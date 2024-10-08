import React, { useState, useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { Client } from "@microsoft/microsoft-graph-client";
import { AuthCodeMSALBrowserAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser";
import { Mail, Archive } from 'lucide-react';
import EmailList from './EmailList';
import { processEmailWithLLM } from '../utils/llmProcessor';

const EmailProcessor: React.FC = () => {
  const { instance, accounts } = useMsal();
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(instance, {
        account: accounts[0],
        scopes: ['Mail.Read', 'Mail.ReadWrite'],
      });

      const graphClient = Client.initWithMiddleware({ authProvider });
      const result = await graphClient.api('/me/messages').top(50).get();
      setEmails(result.value);
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
    setLoading(false);
  };

  const processEmails = async () => {
    setLoading(true);
    for (const email of emails) {
      const importance = await processEmailWithLLM(email.subject, email.bodyPreview);
      if (importance === 'low') {
        await archiveEmail(email.id);
      }
    }
    await fetchEmails();
    setLoading(false);
  };

  const archiveEmail = async (emailId) => {
    try {
      const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(instance, {
        account: accounts[0],
        scopes: ['Mail.ReadWrite'],
      });

      const graphClient = Client.initWithMiddleware({ authProvider });
      await graphClient.api(`/me/messages/${emailId}/move`).post({
        destinationId: 'archive'
      });
    } catch (error) {
      console.error('Error archiving email:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <button onClick={fetchEmails} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <Mail className="mr-2" /> Fetch Emails
        </button>
        <button onClick={processEmails} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center">
          <Archive className="mr-2" /> Process & Archive
        </button>
      </div>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <EmailList emails={emails} />
      )}
    </div>
  );
};

export default EmailProcessor;