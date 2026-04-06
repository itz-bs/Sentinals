#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>
#include <WiFi.h>
#include <HTTPClient.h>

// ─── Display ──────────────────────────────────────────────────────────────────
#define SCREEN_WIDTH  128
#define SCREEN_HEIGHT 64
Adafruit_SH1106G display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
#define OLED_ADDR 0x3C

// ─── Pins ─────────────────────────────────────────────────────────────────────
#define SDA_PIN   8
#define SCK_PIN   9
#define VOLT_PIN  0
#define CURR_PIN  1
#define RELAY_PIN 10
#define BATT_PIN  2

// ─── WiFi ─────────────────────────────────────────────────────────────────────
const char* ssid     = "POCO X6 5G";
const char* password = "";  

// ─── ThingSpeak ───────────────────────────────────────────────────────────────
// Go to https://thingspeak.com → My Channels → New Channel
// Create fields: field1=Voltage, field2=Current, field3=Battery, field4=Leak
const char* ts_api_key    = "YOUR_THINGSPEAK_WRITE_API_KEY";  // Replace this
const char* ts_server     = "http://api.thingspeak.com/update";
const int   ts_interval   = 15000;  // ThingSpeak free tier = min 15s between updates

// ─── Globals ──────────────────────────────────────────────────────────────────
bool wifiConnected = false;
bool hasDisplay    = false;
int  screenMode    = 0;

// =============================================================================
void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("=== ESP32-C6 Power Monitor v4.1 (ThingSpeak) ===");

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);

  Wire.begin(SDA_PIN, SCK_PIN);
  Wire.setClock(100000);

  hasDisplay = initDisplay();
  if (hasDisplay) showWelcomeScreen();
  connectToWiFi();
}

// =============================================================================
// Display Init
// =============================================================================
bool initDisplay() {
  if (display.begin(OLED_ADDR, true)) {
    Serial.println("SH1106 OK at 0x3C");
    display.clearDisplay();
    display.display();
    return true;
  }
  Serial.println("SH1106 NOT FOUND");
  return false;
}

// =============================================================================
// Welcome Screen
// =============================================================================
void showWelcomeScreen() {
  display.clearDisplay();
  display.setTextColor(SH110X_WHITE);
  display.setTextSize(2);
  display.setCursor(10, 8);
  display.println("POWER");
  display.setCursor(10, 30);
  display.println("GUARD");
  display.setTextSize(1);
  display.setCursor(15, 52);
  display.println("ThingSpeak v4.1");
  display.display();
  delay(1800);
}

// =============================================================================
// WiFi
// =============================================================================
void connectToWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.printf("Connecting to %s", ssid);

  if (hasDisplay) {
    display.clearDisplay();
    display.setTextColor(SH110X_WHITE);
    display.setTextSize(1);
    display.setCursor(0, 0);
    display.println("Connecting WiFi...");
    display.println(ssid);
    display.display();
  }

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts++ < 20) {
    delay(400);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    wifiConnected = true;
    Serial.printf("\nConnected! IP: %s\n", WiFi.localIP().toString().c_str());
    if (hasDisplay) {
      display.clearDisplay();
      display.setTextColor(SH110X_WHITE);
      display.setTextSize(1);
      display.setCursor(0, 0);
      display.println("WiFi Connected!");
      display.println(WiFi.localIP().toString());
      display.display();
      delay(1200);
    }
  } else {
    Serial.println("\nWiFi failed — offline mode.");
  }
}

// =============================================================================
// ThingSpeak Upload
// Field mapping:
//   field1 = Voltage raw ADC
//   field2 = Current raw ADC
//   field3 = Battery voltage (V)
//   field4 = Leak flag (0 = safe, 1 = leak)
// =============================================================================
bool uploadToThingSpeak(int vRaw, int iRaw, float battV, const char* lStatus) {
  if (!wifiConnected || WiFi.status() != WL_CONNECTED) return false;

  HTTPClient http;
  char url[256];
  snprintf(url, sizeof(url),
    "%s?api_key=%s&field1=%d&field2=%d&field3=%.2f&field4=%d",
    ts_server,
    ts_api_key,
    vRaw,
    iRaw,
    battV,
    strcmp(lStatus, "YES") == 0 ? 1 : 0
  );

  http.begin(url);
  int httpCode = http.GET();
  http.end();

  if (httpCode == 200) {
    Serial.printf("ThingSpeak OK (entry id: %d)\n", httpCode);
    return true;
  } else {
    Serial.printf("ThingSpeak failed. HTTP code: %d\n", httpCode);
    return false;
  }
}

// =============================================================================
// Status Bar
// =============================================================================
void drawStatusBar(float battV, bool tsOk) {
  display.fillRect(0, 0, 128, 12, SH110X_WHITE);
  display.setTextColor(SH110X_BLACK);
  display.setTextSize(1);
  display.setCursor(2, 2);
  display.printf("POWER GUARD %s", tsOk ? "*" : "-");

  // Battery icon
  display.drawRect(108, 2, 16, 8, SH110X_BLACK);
  display.drawRect(124, 4, 2, 4, SH110X_BLACK);
  int batPct = constrain((int)((battV - 3.0f) / 1.2f * 100.0f), 0, 100);
  int fillW  = map(batPct, 0, 100, 0, 14);
  if (fillW > 0) display.fillRect(109, 3, fillW, 6, SH110X_BLACK);
}

// =============================================================================
// Main Screen
// =============================================================================
void drawMainScreen(int vRaw, int iRaw, const char* pStatus, const char* lStatus, float battV, bool tsOk) {
  display.clearDisplay();
  drawStatusBar(battV, tsOk);

  display.setTextColor(SH110X_WHITE);

  display.setTextSize(2);
  display.setCursor(0, 14);
  display.printf("PWR: %s", pStatus);

  display.setTextSize(1);
  display.setCursor(0, 34);
  display.printf("V:%4d   I:%4d", vRaw, iRaw);

  display.setCursor(0, 44);
  if (strcmp(lStatus, "YES") == 0) {
    display.print(">> LEAK DETECTED! <<");
  } else {
    display.print("Leak: SAFE");
  }

  display.setCursor(0, 54);
  display.printf("Bat:%.2fV %s", battV, tsOk ? "TS:OK" : "TS:--");

  display.display();
}

// =============================================================================
// Detail Screen
// =============================================================================
void drawDetailScreen(int vRaw, int iRaw, float battV, bool tsOk) {
  display.clearDisplay();
  drawStatusBar(battV, tsOk);

  display.setTextColor(SH110X_WHITE);
  display.setTextSize(1);
  display.setCursor(0, 14);

  display.printf("Volt raw : %4d\n", vRaw);
  display.printf("Curr raw : %4d\n", iRaw);
  display.printf("Battery  : %.2fV\n", battV);

  if (wifiConnected) {
    display.printf("IP  : %s\n", WiFi.localIP().toString().c_str());
    display.printf("RSSI: %d dBm\n", WiFi.RSSI());
  } else {
    display.println("WiFi : Offline");
  }

  display.display();
}

// =============================================================================
// Loop
// =============================================================================
void loop() {
  static unsigned long lastSwitch  = 0;
  static unsigned long lastUpload  = 0;
  static bool          lastTsOk    = false;

  int   vRaw    = analogRead(VOLT_PIN);
  int   iRaw    = analogRead(CURR_PIN);
  int   battRaw = analogRead(BATT_PIN);
  float battV   = (battRaw / 4095.0f) * 3.3f * 2.0f;

  const char* pStatus = (vRaw > 1000)                ? "ON"  : "OFF";
  const char* lStatus = (vRaw > 1000 && iRaw > 2000) ? "YES" : "NO";

  // Cut relay on leak
  digitalWrite(RELAY_PIN, (strcmp(lStatus, "YES") == 0) ? LOW : HIGH);

  // Upload every 15 seconds (ThingSpeak free tier limit)
  if (millis() - lastUpload > ts_interval) {
    lastTsOk   = uploadToThingSpeak(vRaw, iRaw, battV, lStatus);
    lastUpload = millis();
  }

  // Toggle screen every 4 seconds
  if (millis() - lastSwitch > 4000) {
    screenMode = !screenMode;
    lastSwitch = millis();
  }

  if (hasDisplay) {
    if (screenMode == 0) {
      drawMainScreen(vRaw, iRaw, pStatus, lStatus, battV, lastTsOk);
    } else {
      drawDetailScreen(vRaw, iRaw, battV, lastTsOk);
    }
  }

  Serial.printf("[V:%4d I:%4d Bat:%.2fV] PWR:%-3s Leak:%-3s WiFi:%s TS:%s\n",
    vRaw, iRaw, battV, pStatus, lStatus,
    wifiConnected ? "OK" : "OFF",
    lastTsOk ? "OK" : "OFF");

  delay(800);
}
