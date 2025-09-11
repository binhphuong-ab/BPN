# MongoDB Atlas Database Credentials

## Connection Information

**Database Service**: MongoDB Atlas  
**Project**: Personal Blog  
**Cluster Name**: BinhPhuongNguyen  

## Authentication Details

| Field | Value |
|-------|--------|
| **Username** | `NguyenBinhPhuong` |
| **Password** | `eRkRBvxPo6STMZA6` |
| **Database Name** | `personal-blog` |
| **Cluster URL** | `binhphuongnguyen.1x4ogft.mongodb.net` |

## Full Connection String

```
mongodb+srv://NguyenBinhPhuong:eRkRBvxPo6STMZA6@binhphuongnguyen.1x4ogft.mongodb.net/?retryWrites=true&w=majority&appName=BinhPhuongNguyen
```

## Collections Used

- **posts** - Blog posts with metadata, content, and view tracking
- **users** - User authentication (when implemented)
- **comments** - Blog post comments (when implemented)

## Environment Configuration

The credentials are also stored in `.env.local`:

```env
MONGODB_URI=mongodb+srv://NguyenBinhPhuong:eRkRBvxPo6STMZA6@binhphuongnguyen.1x4ogft.mongodb.net/?retryWrites=true&w=majority&appName=BinhPhuongNguyen
```

## Security Notes

⚠️ **Important Security Reminders:**

1. **Never commit this file to version control**
2. **Keep credentials secure and private**
3. **Consider using environment variables in production**
4. **Rotate passwords periodically**
5. **Use IP whitelisting in MongoDB Atlas for additional security**

## Connection Status

✅ **Connection Verified**: Successfully tested on September 11, 2025  
✅ **Database Operations**: Create, Read, Update, Delete all working  
✅ **Collections**: Posts collection active with test data  
✅ **Features**: View tracking, automatic metadata generation working  

## MongoDB Atlas Dashboard

Access your cluster dashboard at: https://cloud.mongodb.com/

## Backup Information

- **Automatic Backups**: Enabled in MongoDB Atlas
- **Retention**: As per Atlas plan settings
- **Point-in-time Recovery**: Available (check Atlas plan)

---

**Created**: September 11, 2025  
**Last Updated**: September 11, 2025  
**Status**: Active and Operational
