import datetime
import ssl
import uuid
import paho.mqtt.client as mqtt
import pymssql

temp = 0
hum = 0
groundhum = 0

def lambda_handler(event, context):
    client = mqtt.Client()
    client.tls_set_context(ssl.create_default_context())
    client.username_pw_set("AWSAdmin", "AWSAdmin1")
    client.connect("744fa952db674b449ad30a3a21b48d39.s1.eu.hivemq.cloud", 8883, 60)

    client.on_connect = on_connect
    client.on_message = on_message

    client.loop_forever()  # Start the MQTT client loop

def on_connect(client, userdata, flags, rc):
    print("Connected with code: " + str(rc))
    client.subscribe("Drawer0/temperature") 
    client.subscribe("Drawer0/humidity")
    client.subscribe("Drawer0/groundhumidity")

def on_message(client, userdata, message):
    print("Message received: " + message.payload.decode())

    topic = message.topic

    if topic == "Drawer0/temperature":
        # Code for handling temperature data
        temp = message.payload.decode()
    elif topic == "Drawer0/humidity":
        # Code for handling humidity data
        hum = message.payload.decode()
    elif topic == "Drawer0/groundhumidity":
        # Code for handling ground humidity data
        groundhum = message.payload.decode()

    if (temp != 0 and hum != 0 and groundhum != 0):
        # Insert data into the database
        print("Temperature: " + temp + ", Humidity: " + hum + ", Ground Humidity: " + groundhum)
        conn = pymssql.connect("database-1.cpgsme0uejc2.eu-central-1.rds.amazonaws.com", "admin", "*(tnClq<Xuae!Pe}q}K-~21D]?vG", "VerticalFarm")
        cursor = conn.cursor()
        cursor.execute("INSERT INTO SensorData (DataHistorieId, Luchtvochtigheid, Temperatuur, Bodemvochtigheid, TimeStamp, LadeId) VALUES (%s, %s, %s, %s, %s, %s)", (uuid.uuid4(), hum, temp, groundhum, datetime.datetime.now(), '14006743-a52e-4811-9e36-4728b8d95dae'))
        conn.commit()

        temp = 0
        hum = 0
        groundhum = 0

        client.disconnect()  # Disconnect the client after receiving a message