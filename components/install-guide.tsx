"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  Tabs,
  Tab,
  Fade,
  Chip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Download, Terminal, Github } from "lucide-react";

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

// Export the button component separately
export function InstallGuide() {
  const handleOpenInstallModal = () => {
    // Logic for opening the install modal can be added here if needed in the future.
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
      <Button
        variant="contained"
        onClick={handleOpenInstallModal}
        startIcon={<InfoOutlinedIcon fontSize="small" />}
        sx={{
          borderRadius: "50px",
          px: 3,
          py: 1,
          fontWeight: 600,
          textTransform: "none",
          boxShadow: "0 4px 14px rgba(37, 99, 235, 0.25)",
          background: "linear-gradient(45deg, #2563EB, #4AA9FF)",
          "&:hover": {
            boxShadow: "0 6px 18px rgba(37, 99, 235, 0.35)",
          },
        }}
      >
        Comment installer Ollama ?
      </Button>
    </Box>
  );
}

// Export the content component separately to use in the modal
export function InstallGuideContent() {
  const theme = useTheme();
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
    <Fade in={true} timeout={300}>
      <Box>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              fontWeight: 700,
              letterSpacing: "-0.5px",
              background: "linear-gradient(45deg, #4AA9FF, #2563EB)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Installation d'Ollama
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: "700px", mx: "auto" }}
          >
            Ollama est nécessaire pour exécuter des modèles d'IA localement.
            Suivez les instructions pour votre système d'exploitation.
          </Typography>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="installation platforms"
          variant="fullWidth"
          sx={{
            mb: 3,
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "3px",
            },
            "& .MuiTab-root": {
              fontWeight: 600,
              textTransform: "none",
              minHeight: 48,
              fontSize: "0.95rem",
            },
          }}
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

        {/* macOS Tab */}
        <TabPanel value={tabValue} index={0}>
          <Card
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: "rgba(255, 255, 255, 0.7)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.07)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "primary.lighter",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                }}
              >
                <Download size={20} color={theme.palette.primary.main} />
              </Box>
              <Box>
                <Typography
                  variant="subtitle1"
                  color="text.primary"
                  fontWeight={700}
                  letterSpacing="-0.3px"
                >
                  macOS
                </Typography>
                <Chip
                  label="Compatible macOS 12+"
                  size="small"
                  sx={{
                    bgcolor: "rgba(37, 99, 235, 0.08)",
                    color: "primary.main",
                    fontWeight: 500,
                    height: 24,
                    mt: 0.5,
                  }}
                />
              </Box>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Téléchargez et installez l'application depuis le site officiel.
              Support pour Apple Silicon (M1/M2/M3) et Intel.
            </Typography>
            <Button
              variant="contained"
              size="large"
              fullWidth
              endIcon={<OpenInNewIcon />}
              onClick={() =>
                window.open(
                  "https://ollama.com/download/Ollama-darwin.zip",
                  "_blank"
                )
              }
              sx={{
                bgcolor: theme.palette.primary.main,
                borderRadius: 2,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                "&:hover": {
                  bgcolor: theme.palette.primary.dark,
                  boxShadow: "0 6px 16px rgba(37, 99, 235, 0.3)",
                },
              }}
            >
              Télécharger pour macOS
            </Button>
          </Card>
        </TabPanel>

        {/* Linux Tab */}
        <TabPanel value={tabValue} index={1}>
          <Card
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: "rgba(255, 255, 255, 0.7)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.07)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "rgba(255, 77, 106, 0.1)", // Rouge clair au lieu de secondary.lighter
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                }}
              >
                <Terminal
                  size={20}
                  color="#E11D48" /* Rouge au lieu de theme.palette.secondary.main */
                />
              </Box>
              <Box>
                <Typography
                  variant="subtitle1"
                  color="text.primary"
                  fontWeight={700}
                  letterSpacing="-0.3px"
                >
                  Linux
                </Typography>
                <Chip
                  label="Ubuntu, Debian, Fedora, etc."
                  size="small"
                  sx={{
                    bgcolor: "rgba(255, 77, 106, 0.08)", // Rouge transparent au lieu de rgba(156, 39, 176, 0.08)
                    color: "#E11D48", // Rouge au lieu de secondary.main
                    fontWeight: 500,
                    height: 24,
                    mt: 0.5,
                  }}
                />
              </Box>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Installez via la commande curl depuis le terminal:
            </Typography>
            <Box
              sx={{
                bgcolor: "grey.900",
                color: "grey.200",
                p: 2.5,
                borderRadius: 2,
                mb: 3,
                fontFamily: "monospace",
                fontSize: "0.9rem",
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
                    top: 12,
                    right: 12,
                    color: "grey.400",
                    "&:hover": { color: "white" },
                  }}
                  onClick={handleCopyClick}
                >
                  <ContentCopyIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Box>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              endIcon={<OpenInNewIcon />}
              onClick={() =>
                window.open(
                  "https://github.com/ollama/ollama/blob/main/docs/linux.md",
                  "_blank"
                )
              }
              sx={{
                borderColor: "#E11D48", // Rouge au lieu de theme.palette.secondary.main
                color: "#E11D48", // Rouge au lieu de theme.palette.secondary.main
                borderRadius: 2,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "rgba(255, 77, 106, 0.05)", // Rouge transparent au lieu de rgba(156, 39, 176, 0.05)
                  borderColor: "#BE123C", // Rouge foncé au lieu de theme.palette.secondary.dark
                },
              }}
            >
              Instructions détaillées
            </Button>
          </Card>
        </TabPanel>

        {/* Windows Tab */}
        <TabPanel value={tabValue} index={2}>
          <Card
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: "rgba(255, 255, 255, 0.7)",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.07)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "warning.lighter",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                }}
              >
                <Download size={20} color={theme.palette.warning.main} />
              </Box>
              <Box>
                <Typography
                  variant="subtitle1"
                  color="text.primary"
                  fontWeight={700}
                  letterSpacing="-0.3px"
                >
                  Windows
                </Typography>
                <Chip
                  label="Windows 10/11 avec WSL2"
                  size="small"
                  sx={{
                    bgcolor: "rgba(255, 152, 0, 0.08)",
                    color: "warning.dark",
                    fontWeight: 500,
                    height: 24,
                    mt: 0.5,
                  }}
                />
              </Box>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Téléchargez et installez l'application Windows. WSL2 doit être
              configuré au préalable.
            </Typography>
            <Button
              variant="contained"
              size="large"
              fullWidth
              endIcon={<OpenInNewIcon />}
              onClick={() =>
                window.open(
                  "https://ollama.com/download/OllamaSetup.exe",
                  "_blank"
                )
              }
              sx={{
                bgcolor: theme.palette.warning.main,
                borderRadius: 2,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(255, 152, 0, 0.2)",
                "&:hover": {
                  bgcolor: theme.palette.warning.dark,
                  boxShadow: "0 6px 16px rgba(255, 152, 0, 0.3)",
                },
              }}
            >
              Télécharger pour Windows
            </Button>
          </Card>
        </TabPanel>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="text"
            size="large"
            startIcon={<Github size={18} />}
            endIcon={<OpenInNewIcon fontSize="small" />}
            onClick={() =>
              window.open("https://github.com/ollama/ollama", "_blank")
            }
            sx={{
              color: "text.secondary",
              fontWeight: 500,
              textTransform: "none",
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
      </Box>
    </Fade>
  );
}
