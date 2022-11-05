//Tutorial https://www.mischianti.org/2020/12/07/websocket-on-arduino-esp8266-and-esp32-client-1/ 
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <FastLED.h>

//Requires WebSockets library by Markus Sattler
#include <WebSocketsClient.h>
 
WebSocketsClient webSocket;

#define ONBOARD_LED 2
#define FRAMES_PER_SECOND = 30

//WiFi/WS connection vars
const char *ssid     = "[SSID]";
const char *password = "[PASS]";
const char* WS_HOST = "[HOST]";
const int   WS_PORT = 80;
const char* WS_PATH = "[PATH]";
const char* DISPLAY_ID = "[ID]";
bool connected = false;

//FastLED vars
#define DATA_PIN    12
#define LED_TYPE    WS2812
#define COLOR_ORDER GRB
#define FRAMES_PER_SECOND  120
CRGB* leds;

//Display vars
long millisOfLastFrame = 0;
int numLights = 588;
int millisBtwnFrames = 1000 / FRAMES_PER_SECOND;
 
#define DEBUG_SERIAL Serial
 
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
    int lengthOfFrame = numLights;
    int numBytesRead = 0;
    switch(type) {
        case WStype_DISCONNECTED:
            DEBUG_SERIAL.printf("[WSC] Disconnected!\n");
            connected = false;
            break;
        case WStype_CONNECTED: 
            DEBUG_SERIAL.printf("[WSC] Connected to url: %s\n", payload);
            connected = true;
 
            //Flash lights (LEDs and onboard LED)
            digitalWrite(ONBOARD_LED, HIGH);
            fill_solid(leds, numLights, CRGB::Red);
            FastLED.show();
            delay(300);
            fill_solid(leds, numLights, CRGB::Green);
            FastLED.show();
            delay(300);
            fill_solid(leds, numLights, CRGB::Blue);
            FastLED.show();
            delay(300);
            digitalWrite(ONBOARD_LED, LOW);
            FastLED.clear();
            FastLED.show();
            break;
            
        case WStype_TEXT:
            //DEBUG_SERIAL.printf("[WSc] RESPONSE: %s\n", payload);
            break;
            
        case WStype_BIN:
            DEBUG_SERIAL.printf("[WSc] get binary length: %u\n", length);

            //Read in the frame
            if(length/3 < numLights){
              lengthOfFrame = length/3;
            }
            for(int i = 0; i < lengthOfFrame; i++){
              leds[i].r = payload[numBytesRead++];
              leds[i].g = payload[numBytesRead++];
              leds[i].b = payload[numBytesRead++];
            }
            
            break;
            
        case WStype_PING:
            // pong will be send automatically
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

    //Allocate space for leds
    leds = (CRGB*)calloc(numLights, sizeof(CRGB));
  
    //Tell FastLED about the LED strip configuration
    FastLED.addLeds<LED_TYPE,DATA_PIN,COLOR_ORDER>(leds, numLights).setCorrection(TypicalLEDStrip);
    delay(50);

    //Set up web socket connection
    webSocket.begin(WS_HOST, WS_PORT, WS_PATH);
    webSocket.onEvent(webSocketEvent);
}
 
void loop() {
    webSocket.loop();
    if(connected){
      digitalWrite(ONBOARD_LED, HIGH);
      //If the time to display the next frame has come, display it
      if(millis() - millisOfLastFrame >= millisBtwnFrames){
          FastLED.show();
          webSocket.sendTXT(DISPLAY_ID);
      }
    } else {
      digitalWrite(ONBOARD_LED, LOW);
    }
}
