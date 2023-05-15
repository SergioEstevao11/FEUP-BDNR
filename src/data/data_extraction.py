import pandas as pd
import argparse
from progress.bar import Bar


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
    related_with_processed = pd.DataFrame(columns=["father", "mother", "child"])
    bar = Bar("related_to", max=related_with_processed.shape[0])
    for index, row in families.iterrows():
        bar.next()
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
            related_with_processed = pd.concat([related_with_processed, pd.DataFrame(new_row, index=[0])], ignore_index=True)

    bar.finish

    related_with_processed.to_csv(FINAL_FOLDER + "related_with_processed.csv", index=False)

def parse_royals():
    royals = pd.read_csv(RAW_FOLDER + "master_data/Shortest Path Death Covariates.csv")
    royals_expanded = pd.read_csv(RAW_FOLDER + "updated_royal_dates.csv")
    #export a csv with the following attributes: id, name, year_birth, year_death, dinasty
    royals_processed = pd.DataFrame(columns=["id", "name", "year_birth", "year_death", "dinasty"])
    bar = Bar("royals", max=royals.shape[0] + royals_expanded.shape[0])
    for index, row in royals.iterrows():
        bar.next()
        id = row["Person ID"]
        name = row["Name"]
        year_birth = int(royals_expanded.loc[royals_expanded["Person ID"] == id, "Birth Year"].values[0])
        year_death = row["Year of Death"]
        dinasty = row["Country-Dynasty Association"]
        new_row = {"id": id, "name": name, "year_birth": year_birth, "year_death": year_death, "dinasty": dinasty}
        royals_processed = pd.concat([royals_processed, pd.DataFrame(new_row, index=[0])], ignore_index=True)
    


    for index, row in royals_expanded.iterrows():
        if row["Person ID"] in royals_processed["id"].values:
            continue
        bar.next()
        id = row["Person ID"]
        name = row["Name"].replace("/", " ").replace("  ", " ").strip()
        if "__" in name.split(" ")[-1]:
            #join name except for the last part
            dinasty = name.split(" ")[-2]
            name = "".join(name.split(" ")[:-1])
        else:
            dinasty = name.split(" ")[-1]
        year_birth = row["Birth Year"]
        year_death = row["Death Year"]

        new_row = {"id": id, "name": name, "year_birth": year_birth, "year_death": year_death, "dinasty": dinasty}
        royals_processed = pd.concat([royals_processed, pd.DataFrame(new_row, index=[0])], ignore_index=True)
    
    royals_processed.to_csv(FINAL_FOLDER + "royals_processed.csv", index=False)


def parse_ruled():
    rulers = pd.read_csv(RAW_FOLDER + "master_data/Ruler+Adjacency.csv")
    ruled_processed = pd.DataFrame(columns=["country_id", "person_id", "year_start", "year_end"])
    bar = Bar("ruled", max=rulers.shape[0])
    
    countries = dict()
    for index, row in rulers.iterrows():
        bar.next()
        country_id = row["Country ID"]
        person_id = row["Person ID"]

        #check if the country_id or person_id are digits
        if not str(country_id).isdigit():
            continue
        if not str(person_id).isdigit():
            continue
        

        if country_id not in countries.keys():
            countries[country_id] = {
                person_id: {
                    "year_start": row["Rule Start Year"],
                    "year_end": row["Rule End Year"]
                }
            }
        else:
            if person_id in countries[country_id].keys():
                countries[country_id][person_id]["year_end"] = row["Rule End Year"]
            else:
                countries[country_id][person_id] = {
                    "year_start": row["Rule Start Year"],
                    "year_end": row["Rule End Year"]
                }

    for country_id in countries.keys():
        for person_id in countries[country_id].keys():
            year_start = countries[country_id][person_id]["year_start"]
            year_end = countries[country_id][person_id]["year_end"]
            new_row = {"country_id": country_id, "person_id": person_id, "year_start": int(year_start), "year_end": int(year_end)}
            ruled_processed = pd.concat([ruled_processed, pd.DataFrame(new_row, index=[0])], ignore_index=True)

    bar.finish

    ruled_processed.to_csv(FINAL_FOLDER + "ruled_processed.csv", index=False)



def parse_countries():
    rulers = pd.read_csv(RAW_FOLDER + "master_data/Ruler+Adjacency.csv")
    countries_processed = pd.DataFrame(columns=["id", "name", "religion", "capital", "capital_latitude", "capital_longitude"])
    countries = dict()
    bar = Bar("countries", max=rulers.shape[0])
    for index, row in rulers.iterrows():
        if row["Country ID"] not in rulers.keys():
            countries[row["Country ID"]] = row

    for country_id in countries.keys():
        bar.next()
        country_name = countries[country_id]["Country Name"]
        religion = countries[country_id]["Religion"]
        capital_name = countries[country_id]["Capital_Name"]
        lat = countries[country_id]["Capital_Lat"]
        lon = countries[country_id]["Capital_Long"]

        new_row = {"id": country_id, "name": country_name, "religion": religion, "capital": capital_name, "capital_latitude": lat, "capital_longitude": lon}
        countries_processed = pd.concat([countries_processed, pd.DataFrame(new_row, index=[0])], ignore_index=True)

    bar.finish()
    countries_processed.to_csv(FINAL_FOLDER + "countries_processed.csv", index=False)


    

def parse_participated_in():
    conflicts = pd.read_csv(RAW_FOLDER + "master_data/Final War Dyads.csv")

    participated_in_processed = pd.DataFrame(columns=["conflict_id", "country_id"])
    bar = Bar("participated_in", max=conflicts.shape[0])
    for index, row in conflicts.iterrows():
        bar.next()
        conflict_id = index
        country_id_state1 = row["State 1 ID"]
        country_id_state2 = row["State 2 ID"]

        new_row = {"conflict_id": conflict_id, "country_id": country_id_state1}
        participated_in_processed = pd.concat([participated_in_processed, pd.DataFrame(new_row, index=[0])], ignore_index=True)
        new_row = {"conflict_id": conflict_id, "country_id": country_id_state2}
        participated_in_processed = pd.concat([participated_in_processed, pd.DataFrame(new_row, index=[0])], ignore_index=True)
    bar.finish()
    participated_in_processed.to_csv(FINAL_FOLDER + "participated_in_processed.csv", index=False)

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
    wars = pd.read_csv(RAW_FOLDER + "master_data/Deaths at War Level.csv")
    part_of_processed = pd.DataFrame(columns=["war_id", "conflict_id"])

    bar = Bar("part_of", max=wars.shape[0])

    for index, row in wars.iterrows():
        bar.next()
        war_id = row["War Num"]
        conflict_id = index

        new_row = {"war_id": war_id, "conflict_id": conflict_id}
        part_of_processed = pd.concat([part_of_processed, pd.DataFrame(new_row, index=[0])], ignore_index=True)

    bar.finish()
    part_of_processed.to_csv(FINAL_FOLDER + "part_of_processed.csv", index=False)

def parse_war():
    wars = pd.read_csv(RAW_FOLDER + "master_data/Deaths at War Level.csv")
    conflicts = pd.read_csv(RAW_FOLDER + "master_data/Final War Dyads.csv")
    wars_processed = pd.DataFrame(columns=["id", "name", "year_start", "deaths"])

    bar = Bar("wars", max=wars.shape[0])

    for index, row in wars.iterrows():
        bar.next()
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

    #Add Wars that don't have conflicts/dyads

    # for index, row in conflicts.iterrows():
    #     if row["War Num (Hard)"] not in wars_processed["id"].values:
    #         war_name = row["War Names (Wright War Name Listed First If Available)"]
    #         new_row = {"id": row["War Num (Hard)"], "name": war_name, "year_start": row["Year"], "deaths": "undefined"}
    #         wars_processed = pd.concat([wars_processed, pd.DataFrame(new_row, index=[0])], ignore_index=True)
    
    bar.finish()
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