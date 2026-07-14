def get_recommendation(user):

    age = user.age
    income = user.monthly_income
    savings = user.monthly_savings
    risk = user.risk_level.strip().lower()
    goal = user.investment_goal.strip().lower()

    # LOW RISK

    if risk == "low":

        if "retirement" in goal:

            if income >= 50000:
                return {
                    "product": "Public Provident Fund (PPF)",
                    "expected_return": "7.1%",
                    "risk": "Low",
                    "description": "Government-backed retirement savings with tax benefits."
                }

            return {
                "product": "Recurring Deposit (RD)",
                "expected_return": "6.5% - 7%",
                "risk": "Low",
                "description": "Good for gradually building retirement savings."
            }

        elif "safe" in goal:

            if savings >= 10000:
                return {
                    "product": "Fixed Deposit (FD)",
                    "expected_return": "6.5% - 7.5%",
                    "risk": "Low",
                    "description": "Safe investment with guaranteed returns."
                }

            return {
                "product": "Recurring Deposit (RD)",
                "expected_return": "6.5% - 7%",
                "risk": "Low",
                "description": "Suitable for disciplined monthly savings."
            }

        elif "savings" in goal:

            if savings < 5000:
                return {
                    "product": "Recurring Deposit (RD)",
                    "expected_return": "6.5% - 7%",
                    "risk": "Low",
                    "description": "Ideal for investors starting with smaller monthly savings."
                }

            return {
                "product": "Fixed Deposit (FD)",
                "expected_return": "6.5% - 7.5%",
                "risk": "Low",
                "description": "Better option for higher accumulated savings."
            }

    # MEDIUM RISK

    elif risk == "medium":

        if "retirement" in goal:

            if age < 40:
                return {
                    "product": "National Pension System (NPS)",
                    "expected_return": "9% - 10%",
                    "risk": "Medium",
                    "description": "Suitable for long-term retirement planning."
                }

            return {
                "product": "Public Provident Fund (PPF)",
                "expected_return": "7.1%",
                "risk": "Low",
                "description": "Safer retirement investment for conservative investors."
            }

        elif "gold" in goal:

            return {
                "product": "Gold ETF",
                "expected_return": "8% - 10%",
                "risk": "Medium",
                "description": "Provides portfolio diversification and inflation protection."
            }

    # HIGH RISK 

    elif risk == "high":

        if "wealth" in goal:

            if income >= 80000 and savings >= 20000:

                return {
                    "product": "Mutual Funds",
                    "expected_return": "12% - 15%",
                    "risk": "High",
                    "description": "Ideal for aggressive long-term wealth creation."
                }

            return {
                "product": "Gold ETF",
                "expected_return": "8% - 10%",
                "risk": "Medium",
                "description": "Suitable until investment capacity increases."
            }

    # Default

    return {
        "product": "Fixed Deposit (FD)",
        "expected_return": "6.5% - 7.5%",
        "risk": "Low",
        "description": "Recommended as a safe default investment."
    }