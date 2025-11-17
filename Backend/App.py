from flask import Flask, request, jsonify
from flask_cors import CORS
import base64

app = Flask(__name__)
CORS(app)  # Supaya bisa diakses dari frontend React

# -----------------------------
# ROUTE ANALISA GAMBAR
# -----------------------------
@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()

    image_base64 = data.get("imageBase64")
    image_type = data.get("imageType", "image/jpeg")
    ratio = data.get("ratio", "3:4")

    if not image_base64:
        return jsonify({"error": "No image provided"}), 400

    # -----------------------------
    # Simulasi analisa gambar
    # -----------------------------
    # Di sini bisa diganti logika analisa gambar asli
    prompt = f"Analisa gambar diterima! Tipe: {image_type}, Aspect Ratio: {ratio}"

    # Bisa juga decode base64 kalau mau simpan:
    # image_bytes = base64.b64decode(image_base64)
    # with open("uploaded_image.jpg", "wb") as f:
    #     f.write(image_bytes)

    return jsonify({"prompt": prompt})


# -----------------------------
# RUN SERVER
# -----------------------------
if __name__ == "__main__":
    # Railway akan otomatis menentukan port lewat env variable
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
