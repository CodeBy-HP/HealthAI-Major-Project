#!/usr/bin/env python3
"""
Test script for AI suggestion features
Run this after restarting the backend to verify all endpoints work
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_prescription():
    """Test prescription suggestion endpoint"""
    print("🧪 Testing Prescription Suggestion...")
    
    payload = {
        "patient": {
            "name": "John Doe",
            "age": "45",
            "gender": "Male"
        },
        "vitals": {
            "overallScore": 72,
            "systolic": 145,
            "diastolic": 95,
            "heartRate": 88
        },
        "labReports": []
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/suggest-prescription", json=payload)
        if response.status_code == 200:
            result = response.json()
            print("✅ Prescription endpoint working!")
            print(f"   Medications suggested: {len(result.get('medications', []))}")
            print(f"   First medication: {result['medications'][0]['name']}")
        else:
            print(f"❌ Failed with status {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    print()

def test_lab_tests():
    """Test lab test suggestion endpoint"""
    print("🧪 Testing Lab Test Suggestion...")
    
    payload = {
        "patient": {
            "name": "Jane Smith",
            "age": "52",
            "gender": "Female"
        },
        "vitals": {
            "overallScore": 68
        },
        "labReports": []
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/suggest-lab-tests", json=payload)
        if response.status_code == 200:
            result = response.json()
            print("✅ Lab tests endpoint working!")
            print(f"   Tests suggested: {len(result.get('tests', []))}")
            print(f"   First test: {result['tests'][0]['name']}")
        else:
            print(f"❌ Failed with status {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    print()

def test_followup():
    """Test follow-up plan endpoint"""
    print("🧪 Testing Follow-up Plan...")
    
    payload = {
        "patient": {
            "name": "Bob Johnson",
            "age": "60",
            "gender": "Male"
        },
        "vitals": {
            "overallScore": 75
        },
        "labReports": []
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/generate-followup", json=payload)
        if response.status_code == 200:
            result = response.json()
            print("✅ Follow-up endpoint working!")
            print(f"   Schedule items: {len(result.get('schedule', []))}")
            print(f"   First appointment: {result['schedule'][0]['timeframe']}")
        else:
            print(f"❌ Failed with status {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    
    print()

def test_health():
    """Test if backend is running"""
    print("🏥 Testing Backend Health...")
    
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Backend is running")
        else:
            print(f"⚠️ Backend responded with status {response.status_code}")
    except Exception as e:
        print(f"❌ Cannot reach backend: {str(e)}")
        print("   Make sure backend is running on port 8000")
        return False
    
    print()
    return True

if __name__ == "__main__":
    print("=" * 60)
    print("MediLens AI Features Test Suite")
    print("=" * 60)
    print()
    
    # First check if backend is running
    if not test_health():
        print("\n⚠️ Please start the backend first:")
        print("   cd backend && python -m uvicorn main:app --reload")
        exit(1)
    
    # Test all AI features
    test_prescription()
    test_lab_tests()
    test_followup()
    
    print("=" * 60)
    print("✨ All tests completed!")
    print("=" * 60)
