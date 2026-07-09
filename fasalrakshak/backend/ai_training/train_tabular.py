import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, mean_squared_error, r2_score
import joblib

# Configuration
DATASETS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'datasets'))
MODELS_SAVE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'ai_models', 'tabular'))

def train_crop_recommendation():
    print(f"\n{'='*50}")
    print("🌾 Starting Training: Crop Recommendation (Classification) 🌾")
    print(f"{'='*50}")
    
    csv_path = os.path.join(DATASETS_DIR, 'crop_recommendation', 'Crop_recommendation.csv')
    if not os.path.exists(csv_path):
        print(f"❌ Could not find {csv_path}")
        return

    try:
        df = pd.read_csv(csv_path)
        print(f"Data loaded: {df.shape[0]} rows, {df.shape[1]} columns")

        X = df.drop('label', axis=1)
        y = df['label']

        label_encoder = LabelEncoder()
        y_encoded = label_encoder.fit_transform(y)

        X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

        model = RandomForestClassifier(n_estimators=100, random_state=42)
        print("Training RandomForestClassifier...")
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"✅ Accuracy on test set: {accuracy * 100:.2f}%")

        os.makedirs(MODELS_SAVE_DIR, exist_ok=True)
        model_path = os.path.join(MODELS_SAVE_DIR, 'crop_recommendation_model.pkl')
        encoder_path = os.path.join(MODELS_SAVE_DIR, 'crop_recommendation_encoder.pkl')
        
        joblib.dump(model, model_path)
        joblib.dump(label_encoder, encoder_path)
        print(f"Model saved to: {model_path}")
    except Exception as e:
        print(f"❌ Error during crop recommendation training: {e}")

def train_yield_prediction():
    print(f"\n{'='*50}")
    print("📈 Starting Training: Yield Prediction (Regression) 📈")
    print(f"{'='*50}")

    csv_path = os.path.join(DATASETS_DIR, 'yield.csv')
    if not os.path.exists(csv_path):
        print(f"❌ Could not find {csv_path}")
        return

    try:
        df = pd.read_csv(csv_path)
        print(f"Data loaded: {df.shape[0]} rows")

        # Selecting relevant columns
        features = ['Area', 'Item', 'Year']
        target = 'Value'
        
        df = df[features + [target]].dropna()

        # Encode categorical features
        area_encoder = LabelEncoder()
        item_encoder = LabelEncoder()
        
        df['Area'] = area_encoder.fit_transform(df['Area'])
        df['Item'] = item_encoder.fit_transform(df['Item'])

        X = df[features]
        y = df[target]

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
        print("Training RandomForestRegressor (this might take a moment)...")
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)
        rmse = mean_squared_error(y_test, y_pred, squared=False)
        r2 = r2_score(y_test, y_pred)
        print(f"✅ Yield Prediction RMSE: {rmse:.2f}, R2 Score: {r2:.2f}")

        os.makedirs(MODELS_SAVE_DIR, exist_ok=True)
        model_path = os.path.join(MODELS_SAVE_DIR, 'yield_prediction_model.pkl')
        encoders_path = os.path.join(MODELS_SAVE_DIR, 'yield_prediction_encoders.pkl')
        
        joblib.dump(model, model_path)
        joblib.dump({'area_encoder': area_encoder, 'item_encoder': item_encoder}, encoders_path)
        print(f"Model saved to: {model_path}")
    except Exception as e:
        print(f"❌ Error during yield prediction training: {e}")


def main():
    train_crop_recommendation()
    train_yield_prediction()

if __name__ == "__main__":
    main()
