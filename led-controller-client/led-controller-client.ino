//WS Tutorial https://www.mischianti.org/2020/12/07/websocket-on-arduino-esp8266-and-esp32-client-1/ 
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <FastLED.h>

//Requires WebSockets library by Markus Sattler
#include <WebSocketsClient.h>

#define ONBOARD_LED 2

//WiFi/WS connection vars
WebSocketsClient webSocket;
const char *ssid     = "SSID";                   //REPLACE WITH YOUR SSID
const char *password = "PASS";                   //REPLACE WITH YOUR WIFI PASS
const char* WS_HOST = "lights.taylorgiles.me";   //REPLACE WITH YOUR WS HOST
const int   WS_PORT = 80;                        //REPLACE WITH YOUR WS PORT
const char* WS_PATH = "/ws";                     //REPLACE WITH YOUR WS PATH
const char* DISPLAY_ID = "ID";                   //REPLACE WITH YOUR DEVICE ID
bool connected = false;

//Display vars
const int NUM_LIGHTS = 1000;      //REPLACE WITH YOUR NUMBER OF LIGHTS
const float MAX_BRIGHTNESS = 0.5; //REPLACE WITH YOUR DESIRED MAX BRIGHTNESS LEVEL [0-1]
const int FRAMES_PER_SECOND = 30;
const int FRAMES_TO_BUFFER = FRAMES_PER_SECOND;
const int millisBtwnFrames = 1000 / FRAMES_PER_SECOND;
int numBufferedFrames = 0;
long timeOfLastFrame = 0;

//FastLED vars
#define DATA_PIN    12
#define LED_TYPE    WS2812
#define COLOR_ORDER GRB
CRGB leds[NUM_LIGHTS];
 
#define DEBUG_SERIAL Serial
 
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
    int lengthOfFrame = NUM_LIGHTS;
    int numBytesRead = 0;
    switch(type) {
        case WStype_DISCONNECTED:
            DEBUG_SERIAL.printf("[WSC] Disconnected!\n");
            numBufferedFrames = 0;
            connected = false;
            break;
        case WStype_CONNECTED: 
            DEBUG_SERIAL.printf("[WSC] Connected to url: %s\n", payload);
            connected = true;
            
            //Flash lights (LEDs and onboard LED)
            digitalWrite(ONBOARD_LED, HIGH);
            FastLED.clear();
            FastLED.show();
            delay(100);
            fill_solid(leds, NUM_LIGHTS, CRGB::White);
            FastLED.show();
            delay(100);
            fill_solid(leds, NUM_LIGHTS, CRGB::Red);
            FastLED.show();
            delay(100);
            fill_solid(leds, NUM_LIGHTS, CRGB::Green);
            FastLED.show();
            delay(100);
            fill_solid(leds, NUM_LIGHTS, CRGB::Blue);
            FastLED.show();
            delay(100);
            digitalWrite(ONBOARD_LED, LOW);
            FastLED.clear();
            FastLED.show();
            break;
            
        case WStype_TEXT:
            //DEBUG_SERIAL.printf("[WSc] RESPONSE: %s\n", payload);
            break;
            
        case WStype_BIN:
            //Wait until it is time to display the next frame
            while((millis() - timeOfLastFrame) < millisBtwnFrames);
            timeOfLastFrame = millis();

            //Decrement the counter
            numBufferedFrames--;
            
            //Read in the frame
            if(length/3 > NUM_LIGHTS){
              lengthOfFrame = length/3;
            }
            for(int i = 0; i < lengthOfFrame; i++){
              leds[i].r = payload[numBytesRead++] * MAX_BRIGHTNESS;
              leds[i].g = payload[numBytesRead++] * MAX_BRIGHTNESS;
              leds[i].b = payload[numBytesRead++] * MAX_BRIGHTNESS;
            }

            //Display the frame
            FastLED.show();
            break;
            
        case WStype_PING:
            // pong will be sent automatically
            //DEBUG_SERIAL.printf("[WSc] get ping\n");
            break;
            
        case WStype_PONG:
            // answer to a ping we send
            //DEBUG_SERIAL.printf("[WSc] get pong\n");
            break;
    }
}
 
void setup() {
    DEBUG_SERIAL.begin(115200);
    
    pinMode(ONBOARD_LED, OUTPUT);
    
    for(uint8_t t = 3; t > 0; t--) {
        DEBUG_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
        DEBUG_SERIAL.flush();
        delay(1000);
    }
    DEBUG_SERIAL.println(WiFi.macAddress());

    //Connect to WiFi
    WiFi.begin(ssid, password);
    while(WiFi.status() != WL_CONNECTED){
      delay(500);
      Serial.print(".");
    }
    DEBUG_SERIAL.print("Local IP: "); DEBUG_SERIAL.println(WiFi.localIP());
  
    //Tell FastLED about the LED strip configuration
    FastLED.addLeds<LED_TYPE,DATA_PIN,COLOR_ORDER>(leds, NUM_LIGHTS).setCorrection(TypicalLEDStrip);
    delay(50);

    //Set up web socket connection
    webSocket.begin(WS_HOST, WS_PORT, WS_PATH);
    webSocket.onEvent(webSocketEvent);
}
 
void loop() {
    webSocket.loop();
    
    //Onboard LED (WS connection status light)
    if(connected){
      if(numBufferedFrames < FRAMES_TO_BUFFER/2){
        webSocket.sendTXT(DISPLAY_ID);
        numBufferedFrames += FRAMES_TO_BUFFER;
      }
      digitalWrite(ONBOARD_LED, HIGH);
    } else {
      digitalWrite(ONBOARD_LED, LOW);
    }
}
