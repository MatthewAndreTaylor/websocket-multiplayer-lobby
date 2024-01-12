# Socket multiplayer lobby in Python

This Python server uses Flask and WebSocket to handle real-time communication for a multiplayer lobby. Players can send updates, and the server broadcasts them to all connected clients.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/your-repository.git
    cd your-repository
    ```

2. Create a virtual environment (optional but recommended):

    ```bash
    python -m venv venv
    source venv/bin/activate   # On Windows, use "venv\Scripts\activate"
    ```

3. Install the required packages:

    ```bash
    pip install -r requirements.txt
    ```

## Running the Server

Make sure your virtual environment is activated.

```bash
python app.py
