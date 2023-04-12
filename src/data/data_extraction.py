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

def parse_families():
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


if __name__ == "__main__":
    args = parse_args()
    if args.families or args.all:
        parse_families()