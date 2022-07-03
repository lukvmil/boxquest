from PIL import Image, ExifTags

def read_exif(file):
    img = Image.open(file)

    exif = {
        ExifTags.TAGS[k]: v
        for k, v in img.getexif().items()
        if k in ExifTags.TAGS
    }

    info = img.getexif()
    
    exif_data = {}

    if info:
        for tag, value in info.items():
            decoded = ExifTags.TAGS.get(tag, tag)
            if decoded == "GPSInfo":
                gps_data = {}
                for t in value:
                    sub_decoded = ExifTags.GPSTAGS.get(t, t)
                    gps_data[sub_decoded] = value[t]

                exif_data[decoded] = gps_data
            else:
                exif_data[decoded] = value

    # for key, val in img_exif.items():
    #     if key in ExifTags.TAGS:
    #         print(f'{ExifTags.TAGS[key]}:{val}')
    
    # for key, val in img_exif.items():
    #     if key in ExifTags.GPSTAGS:
    #         print(f'{ExifTags.GPSTAGS[key]}:{val}')
    print(exif_data)

read_exif("C:\\Users\\mille\\Downloads\\20220703_172049(1).jpg")
read_exif("C:\\Users\\mille\\Downloads\\20220703_172228(1).jpg")