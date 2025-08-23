# Manual Testing for useAutoScroll

1. Run the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```
2. Navigate to the conversations page in the browser.
3. Send or receive many messages in quick succession.
4. Observe that the message list scrolls to the bottom smoothly without jumping for every single DOM mutation.
