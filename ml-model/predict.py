"""
Predict whether a URL is malicious.
Usage: python predict.py <url>
       python predict.py --server
"""
import sys, os, json
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'phishing_model.pkl')
_model = None

def load_model():
    global _model
    if _model is None:
        import joblib # type: ignore
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model not found. Run train_model.py first.")
        _model = joblib.load(MODEL_PATH)
    return _model

def predict_url(url):
    from feature_engineering import extract_features, features_to_vector
    model = load_model()
    features = extract_features(url)
    if not features:
        return {'url': url, 'error': 'Could not extract features', 'score': 50}
    vector = [features_to_vector(features)]
    proba = model.predict_proba(vector)[0]
    label = model.predict(vector)[0]
    return {'url': url, 'malicious': bool(label), 'score': int(proba[1]*100),
            'confidence': int(max(proba)*100), 'features': features}

def start_server():
    import importlib
    try:
        fastapi = importlib.import_module('fastapi')
        pydantic = importlib.import_module('pydantic')
        uvicorn = importlib.import_module('uvicorn')
    except ModuleNotFoundError as exc:
        missing = exc.name
        raise RuntimeError(
            f"Missing dependency '{missing}'. Install required packages with "
            f"'pip install fastapi pydantic uvicorn'."
        ) from exc

    FastAPI = fastapi.FastAPI
    BaseModel = pydantic.BaseModel
    app = FastAPI(title='ShieldScan ML', version='1.0.0')

    class Req(BaseModel):
        url: str

    @app.get('/health')
    def health():
        return {'status': 'ok'}

    @app.post('/predict')
    def predict(req: Req):
        return predict_url(req.url)

    uvicorn.run(app, host='0.0.0.0', port=8000)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python predict.py <url>\n       python predict.py --server")
        sys.exit(1)
    if sys.argv[1] == '--server':
        start_server()
    else:
        print(json.dumps(predict_url(sys.argv[1]), indent=2))
