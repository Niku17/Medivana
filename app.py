from flask import Flask, request, jsonify
import re
import nltk
import pandas as pd
import numpy as np
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

nltk.download('stopwords')
nltk.download('punkt')

app = Flask(__name__)

# Load Datasets
medical_data = pd.read_csv("medical_non_medical_filtered.csv")
medicine_data = pd.read_csv("medi.csv")

# Train First Model (Medical/Non-Medical)
vectorizer_medical = TfidfVectorizer()
x_medical = vectorizer_medical.fit_transform(medical_data['Word']).toarray()
y_medical = medical_data.iloc[:, -1].values


Lr = LogisticRegression()
Lr.fit(x_medical, y_medical)

# Train Second Model (Disease to Medicine)
vectorizer_disease = TfidfVectorizer()
x_disease = vectorizer_disease.fit_transform(medicine_data['Symptoms']).toarray()
y_disease = medicine_data.iloc[:, -1].values

Rf = RandomForestClassifier(n_estimators=10, random_state=1)
Rf.fit(x_disease, y_disease)

# Function to Clean Text
def clean_text(text):
    text = re.sub(r'[^a-zA-Z\s]', ' ', text).lower()
    words = word_tokenize(text)
    ps = PorterStemmer()
    stop_words = set(stopwords.words('english'))
    stop_words.remove('not')
    return [ps.stem(word) for word in words if word not in stop_words]

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    symptoms = data.get('symptoms', '')

    cleaned_words = clean_text(symptoms)

    medical_words = []
    for word in cleaned_words:
        word_vector = vectorizer_medical.transform([word]).toarray()
        prediction = Lr.predict(word_vector)[0]
        if prediction == 1:
            medical_words.append(word)

    medicines = []
    for word in medical_words:
        word_vector = vectorizer_disease.transform([word]).toarray()
        prediction = Rf.predict(word_vector)[0]
        medicines.append(prediction)

    return jsonify({'medical_words': medical_words, 'medicines': medicines})

if __name__ == '__main__':
    app.run(debug=True, port=5000)

