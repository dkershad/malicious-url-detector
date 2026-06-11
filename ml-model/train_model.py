"""
Train a Random Forest classifier for URL threat detection.
pip install scikit-learn pandas joblib
python train_model.py
"""
import os
import sys
try:
    import pandas as pd  # type: ignore[reportMissingModuleSource]
    import numpy as np  # type: ignore[reportMissingModuleSource]
except ImportError:
    print('Missing required packages: pandas and numpy. Install with: pip install pandas numpy')
    sys.exit(1)
try:
    from sklearn.ensemble import RandomForestClassifier  # type: ignore[reportMissingModuleSource]
    from sklearn.model_selection import train_test_split, cross_val_score  # type: ignore[reportMissingModuleSource]
    from sklearn.metrics import classification_report, roc_auc_score  # type: ignore[reportMissingModuleSource]
    try:
        import joblib  # type: ignore[reportMissingImports]
    except ImportError:
        print('Missing required package: joblib. Install with: pip install joblib')
        sys.exit(1)
except Exception:
    print('Missing required package: scikit-learn or joblib. Install with: pip install scikit-learn joblib')
    sys.exit(1)
from feature_engineering import extract_features, features_to_vector

def generate_synthetic(n=2000):
    import random, string
    safe = ['https://google.com','https://github.com','https://wikipedia.org',
            'https://amazon.com','https://stackoverflow.com','https://microsoft.com']
    phishing = ['http://secure-{}.tk/verify','http://{}.paypal-login.ml/update',
                'http://amaz0n-verify.xyz/confirm?user={}','http://192.168.1.{}/login']
    rows = [{'url': u, 'label': 0} for u in safe * (n//(2*len(safe)))]
    for _ in range(n//2):
        t = random.choice(phishing).format(
            ''.join(random.choices(string.ascii_lowercase, k=6)),
            random.randint(1,254))
        rows.append({'url': t, 'label': 1})
    random.shuffle(rows)
    return pd.DataFrame(rows)

def train(dataset='dataset.csv', output='phishing_model.pkl'):
    df = pd.read_csv(dataset) if os.path.exists(dataset) else generate_synthetic()
    print(f"Dataset: {len(df)} rows")
    X, y = [], []
    for _, row in df.iterrows():
        f = extract_features(str(row['url']))
        if f: X.append(features_to_vector(f)); y.append(int(row['label']))
    X, y = np.array(X), np.array(y)
    Xt, Xv, yt, yv = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
    model = RandomForestClassifier(n_estimators=200, max_depth=15, class_weight='balanced', n_jobs=-1)
    model.fit(Xt, yt)
    print(classification_report(yv, model.predict(Xv), target_names=['Safe','Malicious']))
    print(f"ROC-AUC: {roc_auc_score(yv, model.predict_proba(Xv)[:,1]):.4f}")
    joblib.dump(model, output)
    print(f"Model saved → {output}")

if __name__ == '__main__': train()
