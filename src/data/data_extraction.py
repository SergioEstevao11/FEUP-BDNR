import pandas as pd
import argparse

FINAL_FOLDER = "./processed_data/"
RAW_FOLDER = "./raw_data/"

def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--all", type=bool, default=False)
    parser.add_argument("--families", type=bool, default=False)
    parser.add_argument("--final_folder", type=bool, default=False)

    args = parser.parse_args()
    return args

def parse_related_to():
    families = pd.read_csv(RAW_FOLDER + "families.csv")
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
    royals = pd.read_csv(RAW_FOLDER + "master_data/Shortest Path Death Covariates.csv")
    royals_date = pd.read_csv(RAW_FOLDER + "dates.csv")
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
    rulers = pd.read_csv(RAW_FOLDER + "master_data/Ruler+Adjacency.csv")
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
    conflicts = pd.read_csv(RAW_FOLDER + "master_data/Final War Dyads.csv")
    conflicts_processed = pd.DataFrame(columns=["id", "year", "type"])
    conflict_types={
        "B": "Balance of Power",
        "C": "Civil",
        "D": "Defensive",
        "I": "Imperial"
    }
    for index, row in conflicts.iterrows():
        type = row["Wright's type [(B)alance of Power; <C>ivil; (D)efensive; (I)mperial ]"]
        if type in conflict_types.keys():
            type = conflict_types[type]
        else:
            type = "Other"
        new_row = {"id": index, "year": row["Year"], "type": type}
        conflicts_processed = pd.concat([conflicts_processed, pd.DataFrame(new_row, index=[0])], ignore_index=True)

    conflicts_processed.to_csv(FINAL_FOLDER + "conflicts_processed.csv", index=False)


def parse_part_of():
    pass

def parse_war():
    wars = pd.read_csv(RAW_FOLDER + "master_data/Deaths at War Level.csv")
    wars_processed = pd.DataFrame(columns=["id", "name", "year_start", "deaths"])

    for index, row in wars.iterrows():
        #check if War Num exists in wars_processed
        if row["War Num"] not in wars_processed["id"].values:
            if row["Brecke War Name 1"] == "0":
                war_name = row["Dyad Sheet War Name"]
            else:
                war_name = row["Brecke War Name 1"]
            new_row = {"id": row["War Num"], "name": war_name, "year_start": row["Brecke Start Year"], "deaths": row["TotalFatal"]}
            wars_processed = pd.concat([wars_processed, pd.DataFrame(new_row, index=[0])], ignore_index=True)
        else:
            wars_processed.loc[wars_processed["id"] == row["War Num"], "deaths"] += row["TotalFatal"]
    
    wars_processed.to_csv(FINAL_FOLDER + "wars_processed.csv", index=False)



def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--all", action='store_true', required=False)
    parser.add_argument("--final_folder", action='store_true', required=False)
    parser.add_argument("--royals", action='store_true', required=False)
    parser.add_argument("--countries", action='store_true', required=False)
    parser.add_argument("--conflicts", action='store_true', required=False)
    parser.add_argument("--wars", action='store_true', required=False)
    parser.add_argument("--edges", action='store_true', required=False)

    args = parser.parse_args()
    return args


#TODO: add all the brecke war names to the wars_processed.csv: make "name" a list of names
#TODO: finish missing edge parsers

if __name__ == "__main__":
    args = parse_args()
    if args.royals or args.all:
        parse_royals()
        print("[SUCCESS] Royals parsed")
    if args.countries or args.all:
        parse_countries()
        print("[SUCCESS] Countries parsed")
    if args.conflicts or args.all:
        parse_conflicts()
        print("[SUCCESS] Conflicts parsed")
    if args.wars or args.all:
        parse_war()
        print("[SUCCESS] Wars parsed")
    if args.edges or args.all:
        parse_related_to()
        parse_ruled()
        parse_participated_in()
        parse_part_of()
        print("[SUCCESS] Edges parsed")