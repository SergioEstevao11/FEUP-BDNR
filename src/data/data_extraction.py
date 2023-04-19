import pandas as pd
import argparse

FINAL_FOLDER = "./processed_data/"

def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--all", type=bool, default=False)
    parser.add_argument("--families", type=bool, default=False)
    parser.add_argument("--final_folder", type=bool, default=False)

    args = parser.parse_args()
    return args

def parse_related_to():
    families = pd.read_csv("./families.csv")
    families = families.loc[:, ~families.columns.str.contains('^Unnamed')]
    families_processed = pd.DataFrame(columns=["father", "mother", "child"])
    for index, row in families.iterrows():
        father = row["Husband"]
        mother = row["Wife"]
        children = row.filter(regex="Child").dropna().values
        for child in children:
            if pd.isna(father):
                father_proc = "?"
            else:
                father_proc = int(father)
            if pd.isna(mother):
                mother_proc = "?"
            else:
                mother_proc = int(mother)
            child_proc = int(child)
            new_row = {"father": father_proc, "mother": mother_proc , "child": child_proc }
            families_processed = pd.concat([families_processed, pd.DataFrame(new_row, index=[0])], ignore_index=True)


    families_processed.to_csv(FINAL_FOLDER + "families_processed.csv", index=False)

def parse_royals():
    royals = pd.read_csv("./master_data/Shortest Path Death Covariates.csv")
    royals_date = pd.read_csv("./dates.csv")
    #export a csv with the following attributes: id, name, year_birth, year_death, dinasty
    royals_processed = pd.DataFrame(columns=["id", "name", "year_birth", "year_death", "dinasty"])
    for index, row in royals.iterrows():
        id = row["Person ID"]
        name = row["Name"]
        year_birth = int(royals_date.loc[royals_date["Person ID"] == id, "Birth Year"].values[0])
        year_death = row["Year of Death"]
        dinasty = row["Country-Dynasty Association"]
        new_row = {"id": id, "name": name, "year_birth": year_birth, "year_death": year_death, "dinasty": dinasty}
        royals_processed = pd.concat([royals_processed, pd.DataFrame(new_row, index=[0])], ignore_index=True)
    
    royals_processed.to_csv(FINAL_FOLDER + "royals_processed.csv", index=False)

def parse_ruled():
    pass

def parse_countries():
    rulers = pd.read_csv("./master_data/Ruler+Adjacency.csv")
    countries_processed = pd.DataFrame(columns=["id", "name", "religion", "capital", "capital_latitude", "capital_longitude"])
    countries = dict()
    for index, row in rulers.iterrows():
        if row["Country ID"] not in rulers.keys():
            countries[row["Country ID"]] = row

    for country_id in countries.keys():
        country_name = countries[country_id]["Country Name"]
        religion = countries[country_id]["Religion"]
        capital_name = countries[country_id]["Capital_Name"]
        lat = countries[country_id]["Capital_Lat"]
        lon = countries[country_id]["Capital_Long"]

        new_row = {"id": country_id, "name": country_name, "religion": religion, "capital": capital_name, "capital_latitude": lat, "capital_longitude": lon}
        countries_processed = pd.concat([countries_processed, pd.DataFrame(new_row, index=[0])], ignore_index=True)

    countries_processed.to_csv(FINAL_FOLDER + "countries_processed.csv", index=False)


    

def parse_participated_in():
    pass

def parse_conflicts():
    pass

def parse_part_off():
    pass

def parse_war():
    pass

def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--all", action='store_true', required=False)
    parser.add_argument("--families", action='store_true', required=False)
    parser.add_argument("--final_folder", action='store_true', required=False)
    parser.add_argument("--royals", action='store_true', required=False)
    parser.add_argument("--countries", action='store_true', required=False)
    parser.add_argument("--edges", action='store_true', required=False)

    args = parser.parse_args()
    return args

if __name__ == "__main__":
    args = parse_args()
    if args.families or args.all:
        parse_related_to()
    if args.royals or args.all:
        parse_royals()
    if args.countries or args.all:
        parse_countries()
    if args.edges or args.all:
        parse_ruled()