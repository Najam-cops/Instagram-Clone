import { Paper, Typography, Avatar, Button } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

export default function RightSidebar() {
  const { user } = useAuth();

  return (
    <Paper className="p-4 sticky top-20">
      <div className="flex items-center gap-3 mb-6">
        <Avatar
          src={user?.profileImage || undefined}
          alt={user?.username || "User"}
        />
        <div>
          <Typography variant="subtitle2" className="font-semibold">
            {user?.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.name}
          </Typography>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <Typography variant="subtitle2" color="text.secondary">
            Suggestions For You
          </Typography>
          <Button size="small">See All</Button>
        </div>

        {/* Placeholder for suggested users - you can integrate this with real data later */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Avatar sx={{ width: 32, height: 32 }} />
              <div>
                <Typography variant="subtitle2" className="text-sm">
                  user_{i}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="text-xs"
                >
                  Suggested for you
                </Typography>
              </div>
            </div>
            <Button size="small">Follow</Button>
          </div>
        ))}
      </div>
    </Paper>
  );
}
