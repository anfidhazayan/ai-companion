import json

def save_fact(fact):

    with open("memory.json", "r") as f:
        data = json.load(f)

    data["facts"].append(fact)

    with open("memory.json", "w") as f:
        json.dump(data, f, indent=4)

def get_memory():

    with open("memory.json", "r") as f:
        data = json.load(f)

    return "\n".join(data["facts"])