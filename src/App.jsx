import "./App.css";
import { LiaBookSolid } from "react-icons/lia";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useState, useEffect } from "react";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import oops from "./assets/oops.png";
import {
  Container,
  Stack,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Typography,
  Paper,
  Switch,
  IconButton,
  Divider,
  Link,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import axios from "axios";
export default function App() {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const fontnames = ["Sans Serif", "Serif", "Mono"];
  const [hide, setHide] = useState(false);
  const [worddetails, setWorddetails] = useState([]);
  const [ischecked, setIschecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [txt, setTxt] = useState("");
  const [error, setError] = useState(false);
  useEffect(() => {
    axios
      .get(`https://api.dictionaryapi.dev/api/v2/entries/en/world`)
      .then((res) => {
        setWorddetails(res.data);
        setLoading(false);
        setError(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const validation = () => {
    if (txt === "") {
      return null;
    } else {
      setLoading(true);
      setError(false);
      axios
        .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${txt}`)
        .then((res) => {
          setWorddetails(res.data);
          setTxt("");
          setLoading(false);
          setError(false);
        })
        .catch((err) => {
          setError(true);
          setLoading(false);
          setWorddetails([]);
          console.log(err);
          setTxt("");
        });
    }
  };

  return (
    <Container sx={{ width: mobile ? "100%" : "50%" }}>
      <Stack direction="row" justifyContent="space-around" alignItem="center">
        <LiaBookSolid
          style={{
            fontSize: mobile ? "3rem" : "4rem",
            color: "grey",
          }}
        />
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={0.5}
          sx={{
            cursor: "pointer",
          }}
        >
          <Typography
            variant="h6"
            onClick={() =>
              document.startViewTransition(() =>
                setHide((prevState) => !prevState)
              )
            }
          >
            {fontnames[0]}
          </Typography>
          <KeyboardArrowDownIcon
            sx={{
              color: "#a84dee",
            }}
          />
          {hide && (
            <Paper
              elevation={2}
              sx={{
                padding: 1.5,
                display: "flex",
                flexDirection: "column",
                gap: 1.2,
                position: "absolute",
                top: 52,
                width: 102,
              }}
            >
              {fontnames.map((fontname, index) => {
                return (
                  <Typography
                    variant="body1"
                    key={index}
                    onClick={() => {
                      setHide((prevState) => !prevState);
                      document.documentElement.body.style.fontFamily =
                        fontnames[index];
                    }}
                  >
                    {fontname}
                  </Typography>
                );
              })}
            </Paper>
          )}
          <hr
            style={{
              width: "2rem",
              transform: "rotate(90deg)",
            }}
          />
          <Stack direction="row" justifyContent="center" alignItems="center">
            <Switch
              color="secondary"
              checked={ischecked}
              onChange={() => {
                document.startViewTransition(() => {
                  setIschecked((prevState) => !prevState);
                  if (ischecked) {
                    document.body.style.backgroundColor = "white";
                    document.body.style.color = "#252525";
                  } else {
                    document.body.style.backgroundColor = "#252525";
                    document.body.style.color = "white";
                  }
                });
              }}
            />
            <DarkModeOutlinedIcon
              sx={{
                color: "grey",
              }}
            />
          </Stack>
        </Stack>
      </Stack>
      <Stack
        sx={{ marginBlockStart: 8 }}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <input
          type="text"
          className="search-input"
          placeholder="Search for any word..."
          value={txt}
          onChange={(e) => setTxt(e.target.value)}
        />
        <SearchOutlinedIcon
          sx={{
            position: "absolute",
            right: mobile ? 33 : 424,
            color: "#a84dee",
          }}
          onClick={validation}
        />
      </Stack>
     
      {loading ? (
        <CircularProgress
          sx={{
            color: "#a84dee",
            position: "absolute",
            top: "50%",
            left:mobile?"45%":"48%"
          }}
        />
      ) : (
        worddetails?.slice(0, 1).map((worddetail, index) => {
          const {
            word,
            phonetic,
            phonetics,
            meanings,
            sourceUrls
          } = worddetail;
          const [nounpart, verbpart] = meanings;
          return (
            <Stack key={index} sx={{ marginBlockStart: 4 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack>
                  <Typography variant="h3">{word}</Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#8e0cf1"
                    }}
                  >
                    {phonetic}
                  </Typography>
                </Stack>
                <IconButton
                  onClick={() => {
                    const audio = new Audio();
                    audio.src = phonetics[0].audio;
                    audio.play();
                  }}
                >
                  <PlayCircleIcon sx={{ fontSize: 60, color: "#8e0cf1" }} />
                </IconButton>
              </Stack>
              <Divider textAlign="left">
                <Typography variant="h6">Noun</Typography>
              </Divider>
              <Typography variant="body1" sx={{ padding: 2 }}>
                Meaning
              </Typography>
              {nounpart?.definitions.map((noundetails, index) => {
                return (
                  <ul key={index}>
                    <li
                      style={{
                        color: ischecked ? "#f5f5f5" : theme.palette.grey[800]
                      }}
                    >
                      {noundetails.definition}
                    </li>
                  </ul>
                );
              })}
              <Stack
                direction="row"
                justifyContent="start"
                alignItems="baseline"
                spacing={1}
              >
                <Typography variant="body1">Synonyms</Typography>
                <div className="synonyms-list">
                  {nounpart?.synonyms.map((synonym, index) => {
                    return (
                      <p key={index} id="li">
                        {synonym}
                      </p>
                    );
                  })}
                </div>
              </Stack>
              <Divider textAlign="left" variant="fullwidth">
                <Typography variant="h6">Verb</Typography>
              </Divider>
              <Typography variant="body1" sx={{ padding: 2 }}>
                Meaning
              </Typography>
              {verbpart?.definitions.map((noundetails, index) => {
                return (
                  <ul key={index}>
                    <li
                      style={{
                        color: ischecked ? "#f5f5f5" : theme.palette.grey[800]
                      }}
                    >
                      {noundetails.definition}
                    </li>
                  </ul>
                );
              })}
              <Divider sx={{ p: 1 }} />
              <Typography varaiant="body1">Source</Typography>
              <Link
                href={sourceUrls[0]}
                underline="none"
                target="_blank"
                color="inherit"
              >
                <Typography varaiant="caption1">{sourceUrls[0]}</Typography>
              </Link>
            </Stack>
          );
        })
      )}
      {error && (
        <div
          style={{
            marginBlockStart:mobile?"50%":'25%'
          }}
        >
          <img
            src={oops}
            style={{
              width: mobile ? 100 : 200,
              display: "block",
              margin: "auto"
            }}
            alt=""
          />
          <Typography variant="body1" textAlign="center">
            Please enter correct word to get the results!
          </Typography>
        </div>
      )}
   
    </Container>
  );
}
