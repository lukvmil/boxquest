from app.models import *

print("Are you sure you want to delete all data?")
if input("> ") == "y":
    print("Type 'BoxQuest' to confirm")
    if input("> ") == "BoxQuest":
        BoxModel.drop_collection()
        EntryModel.drop_collection()
        print("Done")
        quit()
    
print("Failed, exiting")