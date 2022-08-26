from app.models import *

def show_dash():
    total_boxes = len(BoxModel.objects())
    active_boxes = len(BoxModel.objects(active=True))
    total_entries = len(EntryModel.objects())
    print("[BoxQuest Management Dashboard]")
    print(f"{active_boxes}/{total_boxes} active boxes, {total_entries} entries")
    print("[1] Active boxes")
    print("[2] Box by ID")
    print("[Q] Quit")
    print()

def get_box(_id):
    return BoxModel.objects(pub_id=_id).first()

def get_entry(_id):
    return EntryModel.objects(id=_id).first()

def show_entry(box, _id):
    entry = get_entry(_id)
    if not entry:
        print("Invalid ID")
        print()
        return False

    while True:
        print(f"[Entry {entry.id}]")
        print("Timestamp:", entry.timestamp)
        print("Location:", entry.location)
        print("Location String:", entry.location_str)
        print("Message:", entry.message)
        print("Image:", entry.image.grid_id)
        print()
        print("[1] Delete")
        print()
        sel = input("> ")
        
        if sel == "1":
            print("Are you sure?")
            print()
            sel = input("> ")
            if sel == "y":
                box.update(pull__entries=entry)
                entry.delete()
                print("Deleted")
                break
        
        if not sel: break

def show_box(_id):
    box = get_box(_id)
    if not box:
        print("Invalid ID")
        print()
        return False
    
    while True:
        print(f"[Box {box.id}]")
        print("Key:", box.key)
        print("Active:", box.active)
        print("Quest:", box.quest)
        print("Guide:", box.guide)
        print("Public:", box.public)
        print("Entries:", len(box.entries))
        print()
        print("[1] View entries")
        print("[2] Reset")
        print("[3] Delete")
        print()
        sel = input("> ")

        if sel == "1":
            print(f"[Entries for box {box.id}: {box.quest}]")
            for i, e in enumerate(box.entries):
                print(f"[{i+1}] {e.id}")
            print()
            sel = input("> ")
            if not sel: continue
            show_entry(box, box.entries[int(sel)-1].id)
        elif sel == "2":
            print(f"Confirm reset box {box.id}?")
            sel = input("> ")
            if sel == "y":
                box.public = None
                box.quest = None
                box.guide = None
                box.active = False
                for e in box.entries:
                    if not type(e) is EntryModel: continue
                    e.delete()
                box.entries = []
                box.save()
                print("Deleted")
        else: break
    return True

while True:
    show_dash()
    sel = input("> ")

    if sel == "1":
        active_boxes = BoxModel.objects(active=True)
        print("[Active boxes]")
        for i, a in enumerate(active_boxes):
            print(f"[{i+1}] {a.id} {a.quest}")
        print()
        sel = input("> ")
        if not sel: continue
        show_box(active_boxes[int(sel)-1].id)

    elif sel == "2":
        print("Box ID?")
        print()
        sel = input("> ")
        show_box(sel)

    elif sel == "3":
        print("Box ID?")
        print()
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