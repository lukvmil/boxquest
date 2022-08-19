from app.models import *

def show_dash():
    total_boxes = len(BoxModel.objects())
    active_boxes = len(BoxModel.objects(active=True))
    total_entries = len(EntryModel.objects())
    print("BoxQuest Management Dashboard")
    print(f"{active_boxes}/{total_boxes} active boxes, {total_entries} entries")
    print("[1] View Box")
    print("[2] Delete Box")
    print("[Q] Quit")

def get_box(_id):
    return BoxModel.objects(pub_id=_id).first()

def show_box(_id):
    box = get_box()
    if not box:
        print("Invalid ID")
        return False
    
    print("Key:", box.key)
    print("Active:", box.active)
    print("Quest:", box.quest)
    print("Guide:", box.guide)
    print("Public:", box.public)
    print("Entries:", len(box.entries))
    return True

while True:
    show_dash()
    sel = input("> ")

    if sel == "1":
        print("Box ID?")
        sel = input("> ")
        show_box(sel)

    elif sel == "2":
        print("Box ID?")
        sel = input("> ")
        box = get_box(sel)
        if not box: print("Invalid ID"); continue
        print(f"Confirm delete box {box.id}?")
        sel = input("> ")
        if sel == "y":
            box.delete()
            print("Deleted")

    elif sel == "3":
        ...
    elif sel == "q":
        break