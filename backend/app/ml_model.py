import joblib


def load_model():

    try:
        model = joblib.load("model/investment_model.pkl")
        return model

    except:
        return None