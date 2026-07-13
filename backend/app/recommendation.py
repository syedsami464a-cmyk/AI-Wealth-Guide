def get_recommendation(user):

    income = user.monthly_income
    savings = user.monthly_savings
    risk = user.risk_level.lower()
    goal = user.investment_goal.lower()

    # Low Risk
    if risk == "low":

        if "retirement" in goal:
            return {
                "product": "Public Provident Fund (PPF)",
                "expected_return": "7.1%",
                "risk": "Low",
                "description": "Government-backed long-term savings scheme ideal for retirement."
            }

        elif savings < 5000:
            return {
                "product": "Recurring Deposit (RD)",
                "expected_return": "6.5%",
                "risk": "Low",
                "description": "Best for small monthly investments."
            }

        else:
            return {
                "product": "Fixed Deposit (FD)",
                "expected_return": "7%",
                "risk": "Low",
                "description": "Safe investment with guaranteed returns."
            }

    # Medium Risk
    elif risk == "medium":

        if "retirement" in goal:
            return {
                "product": "National Pension System (NPS)",
                "expected_return": "9%",
                "risk": "Medium",
                "description": "Retirement-oriented investment with market-linked returns."
            }

        return {
            "product": "Gold ETF",
            "expected_return": "8%",
            "risk": "Medium",
            "description": "Suitable for wealth preservation and diversification."
        }

    # High Risk
    else:

        if income > 50000:
            return {
                "product": "Mutual Funds",
                "expected_return": "12% - 15%",
                "risk": "High",
                "description": "Suitable for long-term wealth creation."
            }

        return {
            "product": "Gold ETF",
            "expected_return": "8%",
            "risk": "Medium",
            "description": "Balanced investment option."
        }