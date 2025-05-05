from flask import Flask, render_template, request
import io
import base64
import matplotlib
matplotlib.use('agg')
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import tensorflow as tf
from PIL import Image
import pickle
from tensorflow.keras.models import load_model

app = Flask(__name__)

# Load model
model = load_model('my_model5.keras')

# Load history
with open('model_history5.pkl', 'rb') as f:
    history = pickle.load(f)

# Load test data
df_test = pd.read_csv('data_final.csv')
df_test['localtime'] = pd.to_datetime(df_test['localtime'], format='mixed', utc=True)
df_test = df_test.sort_values(by='localtime')
df_test['zone_label'] = list(zip(df_test['Level'], df_test['lat_zone'], df_test['lng_zone']))
df_test['zone_label'] = df_test['zone_label'].astype(str)
zone_to_id = {zone: i for i, zone in enumerate(df_test['zone_label'].unique())}
id_to_zone = {i: zone for zone, i in zone_to_id.items()}
df_test['zone_id'] = df_test['zone_label'].map(zone_to_id)

from sklearn.preprocessing import LabelEncoder
mac_encoder = LabelEncoder()
df_test['device_id'] = mac_encoder.fit_transform(df_test['ClientMacAddr'])
mac_to_id = dict(zip(df_test['ClientMacAddr'], df_test['device_id']))
id_to_mac = dict(zip(df_test['device_id'], df_test['ClientMacAddr']))

device_access_info = {
    "0c:51:01:b2:dc:ea": {"level": 2, "expiry": pd.Timestamp("2025-04-25 04:40:00")},
    "aa:bb:cc:dd:ee:ff": {"level": 1, "expiry": pd.Timestamp.min},
    "11:22:33:44:55:66": {"level": 3, "expiry": pd.Timestamp.max}
}

zone_names = {
    (4, 14): "Controller Room",
    (3, 15): "Reception",
    (4, 15): "Waiting Area",
    (5, 14): "Main Entrance",
    (5, 15): "Security Desk",
    (6, 14): "Elevator Lobby",
    (6, 15): "Visitor Lounge",
    (7, 13): "Workstations Block A",
    (7, 14): "Workstations Block A",
    (7, 15): "Manager Cabin 1",
    (7, 16): "Manager Cabin 2",
    (7, 17): "Open Workspace 1",   # ✅ Added zone 7,17
    (8, 13): "Workstations Block B",
    (8, 14): "Workstations Block B",
    (8, 15): "Manager Cabin 3",
    (8, 16): "Workstations Block C",
    (8, 17): "Open Workspace 2",  # ✅ Added zone 8,17
    (9, 13): "Breakout Area",
    (9, 14): "Pantry Area",
    (9, 15): "Cafeteria",
    (9, 16): "Small Meeting Room",  # ✅ Added zone 9,16
    (9, 17): "Admin Block",
    (10, 13): "Meeting Room A",
    (10, 14): "Meeting Room B",
    (10, 15): "Conference Hall",
    (10, 16): "Projector Room",
    (11, 14): "Server Room",
    (11, 15): "Main Storage",
    (12, 14): "Small Server Room",
    (12, 15): "Supply Storage",
    (13, 13): "HR Cabin",
    (13, 14): "Finance Cabin",
    (13, 15): "Director's Cabin",
    (14, 14): "Washrooms (Men)",
    (14, 15): "Washrooms (Women)",
    (15, 14): "Emergency Exit",
    (15, 15): "Fire Exit",
    (11, 18): "Pump Room",
}




sequence_length = 10

# All your helper functions stay SAME (get_zone_ids_for_lat_lng_range, plot_topk_zone_clean_heatmap_web, predict_future_location_web)

def get_zone_ids_for_lat_lng_range(lat_range, lng_range, floor_levels=None):
    # ... (your original function)
    zone_ids = []
    for zid, zone_label in id_to_zone.items():
        try:
            zone_tuple = eval(zone_label)
        except Exception:
            continue
        if not (isinstance(zone_tuple, tuple) and len(zone_tuple) == 3):
            continue
        lev, lat, lng = zone_tuple
        if floor_levels is not None and lev not in floor_levels:
            continue
        if lat_range[0] <= lat <= lat_range[1] and lng_range[0] <= lng <= lng_range[1]:
            zone_ids.append(zid)
    return zone_ids

def plot_topk_zone_clean_heatmap_web(top_zones, top_probs, current_location=None, floor_images=None, test_location=None, target_zones=None, img_buffer=None):
    # ... (your plotting code exactly)
    max_lat = 20
    max_lng = 20
    grid_size = (max_lat, max_lng)
    processed_top_zones = []
    for zone in top_zones:
        if isinstance(zone, str):
            zone_tuple = eval(zone)
        else:
            zone_tuple = zone
        processed_top_zones.append(zone_tuple)
    top_zones = processed_top_zones

    heatmap = np.full(grid_size, np.nan)
    for (lvl, lat, lng), prob in zip(top_zones, top_probs):
        heatmap[lat, lng] = prob

    plt.figure(figsize=(10, 8), facecolor='white')
    ax = plt.gca()
    ax.set_facecolor('white')
    cmap = plt.cm.Reds.copy()
    cmap.set_bad(color='white')

    img = ax.imshow(heatmap, origin='lower', cmap=cmap, interpolation='none',
                    alpha=0.6, extent=[0, grid_size[1], 0, grid_size[0]],
                    vmin=0, vmax=1, zorder=1)

    ax.set_xlim(0, grid_size[1])
    ax.set_ylim(0, grid_size[0])
    ax.set_xticks(np.arange(0, grid_size[1], 1))
    ax.set_yticks(np.arange(0, grid_size[0], 1))
    ax.grid(True, which='both', color='gray', linewidth=0.5, zorder=0)

    for (lvl, lat, lng) in top_zones:
        ax.text(lng + 0.5, lat + 0.5, f"{lvl}", fontsize=10, color='black',
                ha='center', va='center', zorder=10)

    if current_location:
        _, lat, lng = current_location
        ax.scatter(lng + 0.5, lat + 0.5, color='blue', marker='X', s=300,
                   label='Current Location', zorder=4)

    plt.title("Top Predicted Zones")
    plt.xlabel("Longitude Zone")
    plt.ylabel("Latitude Zone")
    plt.legend()
    plt.tight_layout()

    if img_buffer:
        plt.savefig(img_buffer, format='png')
        plt.close()
    else:
        plt.show()

def predict_future_location_web(device_mac, last_minutes_ahead, target_zones=None, img_buffer=None):
    info = device_access_info.get(device_mac, {"level": 1, "expiry": pd.Timestamp.min})
    level = info["level"]

    df_device = df_test[df_test["ClientMacAddr"] == device_mac].sort_values("localtime")

    if len(df_device) < sequence_length:
        plt.figure(figsize=(10, 6))
        plt.text(0.5, 0.5, "Not enough data to predict", ha='center', va='center', fontsize=14)
        plt.axis('off')
        if img_buffer:
            plt.savefig(img_buffer, format='png')
            plt.close()
        return [], []  # 🛠 Return empty lists safely!

    last_seq = df_device.iloc[-sequence_length:].copy()
    last_seq['lat_diff'] = last_seq['lat_zone'].diff()
    last_seq['lng_diff'] = last_seq['lng_zone'].diff()
    last_seq['t_diff'] = last_seq['localtime'].diff().dt.total_seconds()
    last_seq['speed_zps'] = np.sqrt(last_seq['lat_diff']**2 + last_seq['lng_diff']**2) / last_seq['t_diff']
    last_seq['speed_zps'] = last_seq['speed_zps'].fillna(0)
    last_seq['hour'] = last_seq.localtime.dt.hour
    last_seq['hour_sin'] = np.sin(2*np.pi*last_seq.hour/24)
    last_seq['hour_cos'] = np.cos(2*np.pi*last_seq.hour/24)
    last_seq['dow'] = last_seq.localtime.dt.weekday

    dow_dummies = pd.get_dummies(last_seq['dow'], prefix='dow')
    last_seq = pd.concat([last_seq, dow_dummies], axis=1)
    for i in range(7):
        if f'dow_{i}' not in last_seq.columns:
            last_seq[f'dow_{i}'] = 0

    feature_cols = ['Level', 'lat_zone', 'lng_zone', 'speed_zps', 'hour_sin', 'hour_cos',
                    'dow_0', 'dow_1', 'dow_2', 'dow_3', 'dow_4', 'dow_5', 'dow_6']
    features = last_seq[feature_cols].values.astype(np.float32)

    device_id = mac_to_id.get(device_mac)
    if device_id is None:
        plt.figure(figsize=(10, 6))
        plt.text(0.5, 0.5, f"Device {device_mac} not found", ha='center', va='center', fontsize=14)
        plt.axis('off')
        if img_buffer:
            plt.savefig(img_buffer, format='png')
            plt.close()
        return [], []  # 🛠 Return empty lists safely!

    device_id_array = np.array([[device_id]], dtype=np.float32)
    pred_probs = model.predict([features[np.newaxis, :, :], device_id_array], verbose=0)[0]

    topk_indices = pred_probs.argsort()[-10:][::-1]
    topk_probs = pred_probs[topk_indices]
    topk_zones = [id_to_zone[i] for i in topk_indices]

    current_loc = tuple(last_seq.iloc[-1][["Level", "lat_zone", "lng_zone"]])

    plot_topk_zone_clean_heatmap_web(
        topk_zones,
        topk_probs,
        current_location=current_loc,
        target_zones=target_zones,
        img_buffer=img_buffer
    )

    return topk_zones, topk_probs  # ✅ Always return two things


@app.route('/', methods=['GET', 'POST'])

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/index2')
def index2():
    return render_template('index2.html')

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/explore')
def explore():
    return render_template('explore.html')

@app.route('/predict', methods=['POST'])
def predict():
    device_mac = request.form['mac_id']
    minutes_ahead = int(request.form['time'])
    target_zone_ids = get_zone_ids_for_lat_lng_range((1, 20), (1, 20), floor_levels=[1, 2])

    img_buffer = io.BytesIO()
    topk_zones, topk_probs = predict_future_location_web(device_mac, minutes_ahead, target_zone_ids, img_buffer)

    # ⚡ Only take first zone
    first_zone = topk_zones[0] if topk_zones else None
    first_zone_name = None

    if first_zone:
        level, lat, lng = eval(first_zone) if isinstance(first_zone, str) else first_zone
        first_zone_name = zone_names.get((lat, lng), f"Zone ({lat},{lng})")

    img_buffer.seek(0)
    plot_url = base64.b64encode(img_buffer.getvalue()).decode('utf8')

    return render_template('explore.html', plot_url=plot_url, first_zone_name=first_zone_name)



if __name__ == '__main__':
    app.run(debug=True, port=5001)
