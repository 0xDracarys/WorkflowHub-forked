"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle, PlugZap } from "lucide-react"
import { useUser } from "@clerk/nextjs"

interface GoogleIntegrationSectionProps {
  userProfile: any;
  onConnectSuccess?: () => void; // Add this line
}

export function GoogleIntegrationSection({ userProfile, onConnectSuccess }: GoogleIntegrationSectionProps) {
  const { user } = useUser();
  const [googleConnected, setGoogleConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importingDrive, setImportingDrive] = useState(false);
  const [importingCalendar, setImportingCalendar] = useState(false);
  const [importingGmail, setImportingGmail] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile) {
      setGoogleConnected(!!userProfile.googleTokens?.accessToken);
      setLoading(false);
    }
  }, [userProfile]);

  const handleConnectGoogle = () => {
    if (!user?.id) {
      setError("User not logged in.");
      return;
    }

    const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
    const CLERK_USER_ID = user.id;

    if (!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URI) {
      setError("Google API credentials are not configured. Please check your .env.local file.");
      return;
    }

    const scope = [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/documents",
      "profile",
      "email"
    ].join(" ");

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent&state=${CLERK_USER_ID}`;
    
    const popup = window.open(authUrl, "GoogleOAuth", "width=600,height=600");

    const checkPopup = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(checkPopup);
        // You might want to re-fetch user profile here to update connection status
        // For this example, we'll just re-evaluate googleConnected based on existing userProfile
        setTimeout(() => {
          setGoogleConnected(!!userProfile.googleTokens?.accessToken);
          if (onConnectSuccess) {
            onConnectSuccess(); // Call the callback
          }
        }, 2000);
      }
    }, 1000);
  };

  const handleImportWorkflows = async (service: 'drive' | 'calendar' | 'gmail') => {
    if (!user?.id) {
      setError("User not logged in.");
      return;
    }

    let endpoint = '';
    let setImporting: React.Dispatch<React.SetStateAction<boolean>>;

    switch (service) {
      case 'drive':
        endpoint = '/api/google/drive-workflows';
        setImporting = setImportingDrive;
        break;
      case 'calendar':
        endpoint = '/api/google/calendar-workflows';
        setImporting = setImportingCalendar;
        break;
      case 'gmail':
        endpoint = '/api/google/gmail-workflows';
        setImporting = setImportingGmail;
        break;
      default:
        return;
    }

    setImporting(true);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Successfully imported ${data.workflows.length} workflows from Google ${service}!`);
        // Optionally, refresh workflows on the dashboard
      } else {
        setError(data.error || `Failed to import workflows from Google ${service}.`);
      }
    } catch (err) {
      console.error(`Error importing from Google ${service}:`, err);
      setError(`An unexpected error occurred while importing from Google ${service}.`);
    } finally {
      setImporting(false);
    }
  };

  const handleTestConnection = async () => {
    if (!user?.id) {
      setTestResult("User not logged in.");
      return;
    }

    setTestingConnection(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/google/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (data.success) {
        setTestResult(`Connection successful! Connected as: ${data.data.email}`);
      } else {
        setTestResult(`Connection failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error testing connection:', err);
      setTestResult("An unexpected error occurred while testing connection.");
    } finally {
      setTestingConnection(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
        <p className="text-navy-600 mt-2">Loading integration status...</p>
      </div>
    );
  }

  return (
    <Card className="p-6 border-navy-100">
      <div className="flex items-center space-x-4 mb-4">
        <PlugZap className="w-8 h-8 text-violet-600" />
        <h2 className="text-xl font-semibold text-navy-900">Google Workspace Integration</h2>
      </div>
      <p className="text-navy-600 mb-6">
        Connect your Google account to import workflows from Drive, manage calendar events, and automate Gmail tasks.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center mb-6">
          <AlertCircle className="w-5 h-5 mr-3" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {googleConnected ? (
        <div className="flex flex-col space-y-4">
          <div className="flex items-center bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg">
            <CheckCircle className="w-5 h-5 mr-3" />
            <p className="text-sm font-medium">Google account successfully connected!</p>
            <Button variant="ghost" size="sm" className="ml-auto text-emerald-700 hover:bg-emerald-100" onClick={handleConnectGoogle}>
              Manage Connection
            </Button>
          </div>

          <Button
            onClick={handleTestConnection}
            disabled={testingConnection}
            variant="outline"
            className="w-fit mx-auto text-violet-600 border-violet-200"
          >
            {testingConnection ? 'Testing...' : 'Test Connection'}
          </Button>

          {testResult && (
            <div className={`px-4 py-2 rounded-lg text-sm ${testResult.startsWith('Connection successful') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              {testResult}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 flex flex-col items-center text-center">
              <img src="/icons/google-drive.svg" alt="Google Drive" className="w-12 h-12 mb-2" />
              <h3 className="font-semibold mb-2">Google Drive</h3>
              <p className="text-sm text-navy-600 mb-4">Import documents and spreadsheets as workflows.</p>
              <Button
                onClick={() => handleImportWorkflows('drive')}
                disabled={importingDrive}
                className="w-full"
              >
                {importingDrive ? 'Importing...' : 'Import from Drive'}
              </Button>
            </Card>
            <Card className="p-4 flex flex-col items-center text-center">
              <img src="/icons/google-calendar.svg" alt="Google Calendar" className="w-12 h-12 mb-2" />
              <h3 className="font-semibold mb-2">Google Calendar</h3>
              <p className="text-sm text-navy-600 mb-4">Generate workflows from your recurring events.</p>
              <Button
                onClick={() => handleImportWorkflows('calendar')}
                disabled={importingCalendar}
                className="w-full"
              >
                {importingCalendar ? 'Importing...' : 'Import from Calendar'}
              </Button>
            </Card>
            <Card className="p-4 flex flex-col items-center text-center">
              <img src="/icons/gmail.svg" alt="Gmail" className="w-12 h-12 mb-2" />
              <h3 className="font-semibold mb-2">Gmail</h3>
              <p className="text-sm text-navy-600 mb-4">Create workflows from your email labels and filters.</p>
              <Button
                onClick={() => handleImportWorkflows('gmail')}
                disabled={importingGmail}
                className="w-full"
              >
                {importingGmail ? 'Importing...' : 'Import from Gmail'}
              </Button>
            </Card>
          </div>
        </div>
      ) : (
        <Button
          onClick={handleConnectGoogle}
          className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800"
        >
          <PlugZap className="w-4 h-4 mr-2" />
          Connect Google Account
        </Button>
      )}
    </Card>
  );
}
