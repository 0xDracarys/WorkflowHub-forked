# WorkflowHub User Module

A comprehensive user management and conversation system for the WorkflowHub platform, designed to facilitate interactions between influencers, providers, and clients.

## 🚀 Features

### User Management
- **Multi-Role Support**: Clients, Influencers, and Service Providers
- **Rich Profiles**: Complete user profiles with role-specific information
- **Verification System**: User verification and trust indicators
- **Online Status**: Real-time online/offline status tracking
- **Privacy Controls**: Granular privacy and notification settings

### Conversation System
- **Real-time Messaging**: Instant messaging with typing indicators
- **Rich Content**: Support for text, images, videos, files, and special message types
- **Message Reactions**: Emoji reactions and message interactions
- **Read Receipts**: Message delivery and read status tracking
- **Conversation Types**: Direct, group, project, and support conversations
- **Message Search**: Full-text search across conversations and messages

### Advanced Features
- **Project Proposals**: In-chat proposal system with accept/decline functionality
- **Payment Integration**: Payment tracking and status updates within conversations
- **File Sharing**: Secure file upload and sharing with size/type restrictions
- **Auto-replies**: Automated responses based on triggers and conditions
- **Conversation Analytics**: Engagement metrics and conversation insights

## 📁 Project Structure

```
workflowhub-user/
├── types/
│   ├── user.ts              # User-related type definitions
│   ├── conversation.ts      # Conversation and messaging types
│   └── index.ts            # Exported types
├── lib/
│   ├── user-api.ts         # User CRUD operations
│   ├── conversation-api.ts # Messaging API functions
│   └── index.ts           # Utilities and constants
├── hooks/
│   ├── useUser.ts          # User management hooks
│   ├── useConversation.ts  # Messaging hooks
│   └── index.ts           # Exported hooks
├── components/
│   ├── UserProfileCard.tsx    # User profile display component
│   ├── ConversationList.tsx   # Conversation list sidebar
│   ├── MessageBubble.tsx      # Individual message component
│   ├── UserDashboard.tsx      # Main dashboard interface
│   └── index.ts              # Exported components
├── README.md              # This documentation
└── index.ts              # Main module exports
```

## 🛠️ Installation & Setup

1. **Database Setup**: The module uses MongoDB for data persistence. Ensure your MongoDB connection is configured in the main project.

2. **Import the Module**: Import the components and hooks you need:

```typescript
import { 
  UserDashboard, 
  UserProfileCard,
  ConversationList,
  useUser,
  useConversations,
  WorkflowHubUserAPI 
} from './workflowhub-user'
```

## 🎯 Usage Examples

### Basic User Profile Display

```tsx
import { UserProfileCard } from './workflowhub-user'

function UserCard({ user }: { user: UserProfile }) {
  return (
    <UserProfileCard
      user={user}
      variant="default"
      onMessage={() => console.log('Start conversation')}
      onFollow={() => console.log('Follow user')}
    />
  )
}
```

### Complete User Dashboard

```tsx
import { UserDashboard } from './workflowhub-user'

function Dashboard({ currentUser }: { currentUser: UserProfile }) {
  return (
    <UserDashboard 
      currentUser={currentUser}
      className="min-h-screen"
    />
  )
}
```

### Custom User Hook Usage

```tsx
import { useUser, useUserStats } from './workflowhub-user'

function UserInfo({ userId }: { userId: string }) {
  const { user, loading, updateUser } = useUser(userId)
  const { stats } = useUserStats(userId)

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>{user?.firstName} {user?.lastName}</h1>
      <p>Total Earnings: ${stats?.totalEarnings}</p>
    </div>
  )
}
```

### Conversation Management

```tsx
import { useConversations, ConversationList } from './workflowhub-user'

function MessagingInterface({ userId }: { userId: string }) {
  const { conversations, createConversation } = useConversations(userId)
  const [selected, setSelected] = useState<Conversation | null>(null)

  return (
    <div className="grid grid-cols-3 gap-4">
      <ConversationList
        conversations={conversations}
        currentUserId={userId}
        onConversationSelect={setSelected}
        selectedConversationId={selected?._id}
      />
      {/* Chat interface would go here */}
    </div>
  )
}
```

## 🔧 API Reference

### User API

#### `WorkflowHubUserAPI.createUserProfile(userData)`
Creates a new user profile.

#### `WorkflowHubUserAPI.getUserProfile(userId)`
Retrieves a user profile by ID.

#### `WorkflowHubUserAPI.updateUserProfile(userId, updateData)`
Updates user profile information.

#### `WorkflowHubUserAPI.searchUsers(filters, pagination)`
Searches users with filtering and pagination.

### Conversation API

#### `ConversationAPI.createConversation(conversationData)`
Creates a new conversation.

#### `ConversationAPI.sendMessage(messageData)`
Sends a message to a conversation.

#### `ConversationAPI.getMessages(conversationId, filters, pagination)`
Retrieves messages from a conversation.

## 🎨 Styling & Theming

The module uses the existing WorkflowHub design system with:

- **Color Palette**: Navy, Violet, Emerald color scheme
- **Typography**: Geist Sans font family
- **Components**: Shadcn/ui component library
- **Responsive**: Mobile-first responsive design
- **Dark Mode**: Theme provider support (inherited from main app)

### Custom Styling

Components accept `className` props for custom styling:

```tsx
<UserProfileCard 
  user={user}
  className="custom-profile-styles"
/>
```

## 🔐 Security Features

### Privacy Controls
- Profile visibility settings (public/private/connections)
- Message permissions (everyone/connections/nobody)
- Activity visibility toggles

### Data Validation
- Input sanitization for all user data
- File type and size validation for uploads
- Message length restrictions

### Moderation
- Message reporting system
- Content moderation hooks
- Conversation blocking/archiving

## 🚀 Performance Optimizations

### Efficient Data Loading
- Pagination for large datasets
- Virtual scrolling for message lists
- Image lazy loading and compression

### Caching Strategy
- React Query integration for API caching
- Optimistic updates for immediate UI feedback
- Background sync for offline capabilities

### Bundle Optimization
- Tree-shaking friendly exports
- Lazy loading for heavy components
- Optimized asset delivery

## 🧪 Testing

### Unit Tests
- Individual component testing
- Hook behavior validation
- API function testing

### Integration Tests
- User flow testing
- Real-time messaging simulation
- Cross-browser compatibility

### E2E Tests
- Complete user journey testing
- Performance benchmarking
- Accessibility compliance

## 📱 Mobile Support

The module is fully responsive with:
- Touch-optimized interactions
- Mobile-specific layouts
- Progressive Web App features
- Offline messaging support

## 🔄 Real-time Features

### WebSocket Integration
```typescript
// Real-time status updates
const { updateUserStatus, getUserStatus } = useOnlineStatus()

// Typing indicators
const { setUserTyping, typingUsers } = useTypingStatus(conversationId)
```

### Live Updates
- Online/offline status
- Typing indicators
- Message delivery status
- New conversation notifications

## 🛡️ Error Handling

### Graceful Degradation
- Offline mode support
- Network error recovery
- Retry mechanisms for failed operations

### User Feedback
- Loading states for all operations
- Clear error messages
- Toast notifications for status updates

## 🔮 Future Enhancements

### Planned Features
- Voice messages
- Video calling integration
- Advanced message encryption
- AI-powered message suggestions
- Advanced analytics dashboard

### Performance Improvements
- Message virtualization
- Advanced caching strategies
- Background message sync
- Optimized image processing

## 📖 Migration Guide

### From v0.x to v1.0
- Update import statements
- Replace deprecated props
- Update database schema
- Migrate user preferences

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the existing code style
4. Add tests for new features
5. Update documentation
6. Submit a pull request

## 📄 License

This module is part of the WorkflowHub project and follows the same licensing terms.

## 🆘 Support

For issues and questions:
- Check the GitHub issues
- Review the documentation
- Contact the development team

---

**Built with ❤️ for the WorkflowHub platform**
