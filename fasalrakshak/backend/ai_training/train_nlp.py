import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.metrics import classification_report
import joblib

# Configuration
DATASETS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'datasets'))
MODELS_SAVE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'ai_models', 'nlp'))

def train_agro_qa_intent():
    print(f"\n{'='*50}")
    print("🌾 Starting NLP Training: AgroQA Intent/Crop Classification 🌾")
    print(f"{'='*50}")
    
    csv_path = os.path.join(DATASETS_DIR, 'AgroQA Dataset.csv')
    if not os.path.exists(csv_path):
        print(f"❌ Could not find {csv_path}")
        return

    try:
        # Load and clean data
        df = pd.read_csv(csv_path)
        print(f"Data loaded: {df.shape[0]} rows")
        
        # Drop rows with missing Question or Crop
        df = df.dropna(subset=['Question', 'Crop'])
        
        X = df['Question']
        y = df['Crop']

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Build pipeline
        model = make_pipeline(TfidfVectorizer(stop_words='english', max_features=5000), LogisticRegression(max_iter=1000))
        
        print("Training TF-IDF + Logistic Regression model...")
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)
        print("\n✅ Classification Report on Test Set:")
        # We will suppress warnings if some classes are zero by setting zero_division=0
        print(classification_report(y_test, y_pred, zero_division=0))

        os.makedirs(MODELS_SAVE_DIR, exist_ok=True)
        model_path = os.path.join(MODELS_SAVE_DIR, 'agroqa_intent_model.pkl')
        
        joblib.dump(model, model_path)
        print(f"Model saved to: {model_path}")
        
    except Exception as e:
        print(f"❌ Error during AgroQA NLP training: {e}")

def train_disease_symptom():
    print(f"\n{'='*50}")
    print("🏥 Starting NLP Training: Disease from Symptom Predictor 🏥")
    print(f"{'='*50}")
    
    csv_path = os.path.join(DATASETS_DIR, 'Diseases_Symptoms.csv')
    if not os.path.exists(csv_path):
        print(f"❌ Could not find {csv_path}")
        return

    try:
        df = pd.read_csv(csv_path)
        print(f"Data loaded: {df.shape[0]} rows")
        
        df = df.dropna(subset=['Symptoms', 'Name'])
        
        X = df['Symptoms']
        y = df['Name']

        # Since it's a small dataset and might have only 1 example per disease, 
        # we will just train on the whole dataset to build an associative model.
        print("Training on full dataset to build associative mapping...")
        model = make_pipeline(TfidfVectorizer(stop_words='english'), LogisticRegression(max_iter=1000))
        model.fit(X, y)

        print("✅ Training complete.")
        
        os.makedirs(MODELS_SAVE_DIR, exist_ok=True)
        model_path = os.path.join(MODELS_SAVE_DIR, 'symptom_to_disease_model.pkl')
        
        joblib.dump(model, model_path)
        print(f"Model saved to: {model_path}")
        
    except Exception as e:
        print(f"❌ Error during Disease/Symptom training: {e}")

def main():
    train_agro_qa_intent()
    train_disease_symptom()

if __name__ == "__main__":
    main()
