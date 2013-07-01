{
    "plugin": "att.phone.generic",
    "description": "Common interface for making and receiving phone calls.",
    "methods": {
        "att.dial": {
            "description": "Dial a number and make an outgoing call.",
            "parameters": [
                {"name": "phoneNumber", "type": "string"}
            ],
            "returns": "Call"
        }
    },
    "events": {
        "phoneReady": {
            "description": "Raised when the phone backend has been initialized and is ready to make or receive calls."
        },
        "phoneError": {
            "description": "Raised when the phone backend could not be initialized."
        },
        "calling": {
            "description": "Raised with the phone number being dialed on an outgoing call.",
            "args": [
                {"type": "string"}
            ]
        },
        "outgoingCall": {
            "description": "Raised with a Call object for managing an outgoing call, and the phone number that is being dialed.",
            "args": [
                {"type": "Call"},
                {"type": "string", "name": "callerDisplayName"}
            ]
        },
        "incomingCall": {
            "description": "Raised with a Call object for managing an incoming call, and the phone number of the caller.",
            "args": [
                {"type": "Call"},
                {"type": "string", "name": "callerDisplayName"}
            ]
        },
        "ring": {
            "description": "A signal that a call request is in progress.",
            "args": [
                {"type": "Call"},
                {"type": "string", "name": "callerDisplayName"}
            ]
        },
        "callBegin": {
            "description": "Raised when a call has been answered and is ready for use.",
            "args": [
                {"type": "Call"}
            ]
        },
        "callEnd": {
            "description": "Raised when a call has been hung up.",
            "args": [
                {"type": "Call"}
            ]
        },
        "callError": {
            "description": "Emitted when an error has occured while establishing or during a call.",
            "args": [
                {"type": "Call"}
            ]
        } 
    },
    "datatypes": {
        "Call": {
            "description": "A phone call session, which may be answered or hung up.",
            "methods": {
                "answer": {
                    "description": "Accept and answer an incoming phone call."
                },
                "hangup": {
                    "description": "Decline, or end an existing, phone call"
                }
            },
            "events": [
                "ring",
                "callBegin",
                "callEnd",
                "callError"
            ]
        }
    }
}
