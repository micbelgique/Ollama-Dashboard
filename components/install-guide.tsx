"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  Collapse,
  Tabs,
  Tab,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DownloadIcon from "@mui/icons-material/Download";
import TerminalIcon from "@mui/icons-material/Terminal";
import GitHubIcon from "@mui/icons-material/GitHub";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

// TabPanel component for the tabbed interface
interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
  [key: string]: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`install-tabpanel-${index}`}
      aria-labelledby={`install-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export function InstallGuide() {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleTabChange = (
    _: React.SyntheticEvent<Element, Event>,
    newValue: number
  ): void => {
    setTabValue(newValue);
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(
      "curl -fsSL https://ollama.com/install.sh | sh"
    );
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setIsOpen(!isOpen)}
          startIcon={
            isOpen ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            )
          }
          endIcon={<HelpOutlineIcon fontSize="small" />}
          sx={{
            borderColor: "rgba(74, 169, 255, 0.5)",
            color: "#4AA9FF",
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(4px)",
            "&:hover": {
              borderColor: "#4AA9FF",
              background: "rgba(74, 169, 255, 0.05)",
            },
            px: 3,
          }}
        >
          {isOpen
            ? "Masquer l'aide d'installation"
            : "Comment installer Ollama ?"}
        </Button>
      </Box>

      <Collapse in={isOpen}>
        <Card
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid",
            borderColor: "rgba(74, 169, 255, 0.2)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            borderRadius: 2,
            overflow: "hidden",
            mt: 2,
            mb: isOpen ? 3 : 0,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ mb: 3, textAlign: "center" }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  color: "text.primary",
                  background: "linear-gradient(to right, #4AA9FF, #2563EB)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <InfoOutlinedIcon sx={{ fontSize: 18 }} />
                Installation d'Ollama
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: "700px", mx: "auto" }}
              >
                Ollama est nécessaire pour exécuter des modèles d'IA localement.
                Suivez ces instructions pour l'installer sur votre système.
              </Typography>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="installation platforms"
                centered
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab
                  label="macOS"
                  id="install-tab-0"
                  aria-controls="install-tabpanel-0"
                />
                <Tab
                  label="Linux"
                  id="install-tab-1"
                  aria-controls="install-tabpanel-1"
                />
                <Tab
                  label="Windows"
                  id="install-tab-2"
                  aria-controls="install-tabpanel-2"
                />
              </Tabs>
            </Box>

            {/* macOS Tab */}
            <TabPanel value={tabValue} index={0}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: "rgba(255, 255, 255, 0.7)",
                  border: "1px solid",
                  borderColor: "grey.100",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.05)",
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        bgcolor: "primary.lighter",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 2,
                      }}
                    >
                      <DownloadIcon
                        sx={{ fontSize: 16, color: theme.palette.primary.main }}
                      />
                    </Box>
                    <Typography
                      variant="subtitle2"
                      color="text.primary"
                      fontWeight={600}
                    >
                      macOS
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Téléchargez et installez l'application depuis le site
                    officiel. Compatible avec macOS 12 ou supérieur.
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    endIcon={<OpenInNewIcon fontSize="small" />}
                    onClick={() =>
                      window.open("https://ollama.com/download/mac", "_blank")
                    }
                    sx={{
                      color: "primary.main",
                      borderColor: "primary.light",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "primary.lighter",
                      },
                    }}
                  >
                    Télécharger pour macOS
                  </Button>
                </CardContent>
              </Card>
            </TabPanel>

            {/* Linux Tab */}
            <TabPanel value={tabValue} index={1}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: "rgba(255, 255, 255, 0.7)",
                  border: "1px solid",
                  borderColor: "grey.100",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.05)",
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        bgcolor: "secondary.lighter",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 2,
                      }}
                    >
                      <TerminalIcon
                        sx={{
                          fontSize: 16,
                          color: theme.palette.secondary.main,
                        }}
                      />
                    </Box>
                    <Typography
                      variant="subtitle2"
                      color="text.primary"
                      fontWeight={600}
                    >
                      Linux
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Installez via la commande curl depuis le terminal:
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: "grey.900",
                      color: "grey.200",
                      p: 1.5,
                      borderRadius: 1,
                      mb: 2,
                      fontFamily: "monospace",
                      fontSize: "0.75rem",
                      overflow: "auto",
                      position: "relative",
                    }}
                  >
                    curl -fsSL https://ollama.com/install.sh | sh
                    <Tooltip
                      title={copySuccess ? "Copié!" : "Copier la commande"}
                      placement="top"
                      arrow
                    >
                      <IconButton
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          color: "grey.400",
                          "&:hover": { color: "white" },
                        }}
                        onClick={handleCopyClick}
                      >
                        <ContentCopyIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    endIcon={<OpenInNewIcon fontSize="small" />}
                    onClick={() =>
                      window.open("https://ollama.com/download/linux", "_blank")
                    }
                    sx={{
                      color: "secondary.main",
                      borderColor: "secondary.light",
                      "&:hover": {
                        borderColor: "secondary.main",
                        bgcolor: "secondary.lighter",
                      },
                    }}
                  >
                    Instructions détaillées
                  </Button>
                </CardContent>
              </Card>
            </TabPanel>

            {/* Windows Tab */}
            <TabPanel value={tabValue} index={2}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: "rgba(255, 255, 255, 0.7)",
                  border: "1px solid",
                  borderColor: "grey.100",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.05)",
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        bgcolor: "warning.lighter",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 2,
                      }}
                    >
                      <DownloadIcon
                        sx={{ fontSize: 16, color: theme.palette.warning.main }}
                      />
                    </Box>
                    <Typography
                      variant="subtitle2"
                      color="text.primary"
                      fontWeight={600}
                    >
                      Windows
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Téléchargez et installez l'application Windows. Compatible
                    avec Windows 10/11 avec WSL2.
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    endIcon={<OpenInNewIcon fontSize="small" />}
                    onClick={() =>
                      window.open(
                        "https://ollama.com/download/windows",
                        "_blank"
                      )
                    }
                    sx={{
                      color: "warning.main",
                      borderColor: "warning.light",
                      "&:hover": {
                        borderColor: "warning.main",
                        bgcolor: "warning.lighter",
                      },
                    }}
                  >
                    Télécharger pour Windows
                  </Button>
                </CardContent>
              </Card>
            </TabPanel>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                variant="text"
                size="small"
                startIcon={<GitHubIcon fontSize="small" />}
                endIcon={<OpenInNewIcon fontSize="small" />}
                onClick={() =>
                  window.open("https://github.com/ollama/ollama", "_blank")
                }
                sx={{
                  color: "text.secondary",
                  "&:hover": {
                    color: "primary.main",
                    bgcolor: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                Documentation complète sur GitHub
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Collapse>
    </Box>
  );
}
