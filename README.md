<img src="https://github.com/user-attachments/assets/48ce5f5d-c13a-4768-af16-475510a8e813" alt="Image" height="300" width="100%"/>



# SafeTrace: Predictive Location Tracking for Emergency Response
🔗 [Video Link](https://youtu.be/tZ2p5t_8boQ)

**SafeTrace** is a life-saving predictive analytics system developed to locate missing personnel in high-risk industrial environments, such as oil rigs, during emergencies. When real-time tracking fails—due to explosions, network outages, or damaged devices—SafeTrace leverages historical location data and trained deep learning models to estimate the most probable location of missing individuals.

## 🔑 Key Features

- **Predictive Tracking**: Uses past movement patterns and device history to forecast likely locations.
- **Zone-Based Localization**: Defines custom building zones using shapely/geostructures and bounding polygons.
- **Signal Loss Recovery**: Provides fallback predictions even when a device goes offline during a disaster.
- **Speed & Time Awareness**: Incorporates device velocity and cyclical patterns (e.g., time of day/week) for higher prediction accuracy.
- **Multi-Floor Support**: Processes spatial data across multiple floors in complex building layouts.

## ⚙️ How It Works

- **Data Ingestion**: Receives MAC address pings and zone data from Kiana’s real-time system.
- **Preprocessing**: Cleans spatial data and maps it to defined zones. Removes outliers using geometric boundaries.
- **Model Training**: Trains LSTM and Bi-LSTM networks on sequences of historical movements and zone transitions.
- **Prediction**: In case of signal loss, outputs top 10 likely zones where a person might be found.

## 🚀 Getting Started

### ✅ Requirements

- Python 3.x  
- Flask  
- TensorFlow / Keras  
- NumPy, Pandas  
- GeoPandas, Shapely  

Install dependencies

### ▶️ Running the App

Run the Flask app locally:

```bash
python app.py
```

Then open your browser and navigate to:

```
http://127.0.0.1:5000/
```

---

## 📦 Model Info

- **Model file**: `my_model5.keras`  
- **Training history**: `model_history5.pkl`  
- The model was trained using sequences of MAC address zone transitions to predict top 10 likely zones.

---

## 💡 Example Use Cases

- **Oil & Gas**: Help locate workers post-explosion where Wi-Fi routers are damaged.
- **Manufacturing Plants**: Predict fallback positions for unreachable personnel.
- **Smart Buildings**: Assist emergency teams during fire drills or actual evacuations.

## 🔍 Learn More

Explore our [presentation](https://drive.google.com/file/d/1CR_UCZ1vsnd7AIv01npBkRlHhDMsyd7r/view?usp=sharing) for technical details and results.
