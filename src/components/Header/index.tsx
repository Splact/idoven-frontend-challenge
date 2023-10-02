import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";

export type THeaderProps = {
  title?: string;
};

const Header = ({ title }: THeaderProps) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <MonitorHeartIcon color="inherit" sx={{ mr: 2 }} />

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title ?? "Idoven.ai Coding Challenge"}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
