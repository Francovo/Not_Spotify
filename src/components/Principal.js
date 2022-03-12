import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  chakra,
  Flex,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ModalDetail } from "./Modal";
const Form = chakra("form");

const Spotify = () => {
  const CLIENT_ID = "5514ab31b83749808de57a32d88fb3c9";
  const REDIRECT_URI = "https://prueba-tecnica-body-tech.vercel.app";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [usuario, setUsuario] = useState("");

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [page, setPage] = useState(0);

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  useEffect(() => {
    wait(1000).then(() => {
      const hash = window.location.hash;
      let token = window.localStorage.getItem("token");

      if (!token && hash) {
        token = hash
          .substring(1)
          .split("&")
          .find((elem) => elem.startsWith("access_token"))
          .split("=")[1];

        window.location.hash = "";
        window.localStorage.setItem("token", token);
      }

      setToken(token);
      const profile = async () => {
        let { data: user } = await axios.get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsuario(user);
      };

      if (token) {
        profile();
      }
    });
  }, []);

  useEffect(() => {
    const Pagination = async () => {
      setSongs([]);
      setError(false);
      setLoading(true);
      if (searchKey !== "") {
        const { data } = await axios.get("https://api.spotify.com/v1/search", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            q: searchKey,
            type: "track",
            limit: 15,
            offset: page * 5,
          },
        });
        setSongs(data.tracks.items);
        if (data.length === undefined) {
          setError(true);
        }
        setLoading(false);
      }
    };
    Pagination();
  }, [page, searchKey, token]);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const search = async (e) => {
    e.preventDefault();
  };

  return (
    <Box bg="#191414" color="white">
      <Box>
        <Box as="header">
          <Flex
            justifyContent="space-between"
            padding=".5rem 2rem"
            alignItems="center"
          >
            {usuario ? <Avatar src={usuario.images[0]?.url} /> : <Avatar />}
            <Text fontSize="xl" fontWeight="bold" id="title">
              Not Spotify
            </Text>
            {!token ? (
              <>
                <Button color="black" colorScheme="whatsapp" id="Login">
                  <a
                    href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
                  >
                    Login to Spotify
                  </a>
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={logout}
                  color="black"
                  colorScheme="whatsapp"
                  id="logout"
                >
                  Logout
                </Button>
              </>
            )}
          </Flex>

          {token ? (
            <Form
              id="form-data"
              onSubmit={search}
              padding="2rem"
              display="flex"
            >
              <Input
                placeholder="Ingresa tu busqueda"
                id="inputSpotify"
                type="text"
                onChange={(e) => setSearchKey(e.target.value)}
                bg="white"
                color="black"
                padding=".5rem"
                borderRadius="5px 0 0 5px"
              />
              <Button
                id="btnSearch"
                type={"submit"}
                color="black"
                colorScheme="whatsapp"
                borderRadius="0 5px 5px 0 "
              >
                Search
              </Button>
            </Form>
          ) : (
            <Box
              fontSize="xx-large"
              bg="#1DB954"
              padding=".5rem 1rem"
              border="solid 1px"
              color="black"
            >
              Please login
            </Box>
          )}
        </Box>

        {songs.length > 0 ? (
          <>
            <Flex justify="left" id="Tabla-Data" padding="0 0 2rem 3rem">
              <ButtonGroup isAttached colorScheme="whatsapp">
                <Button
                  id="Previus"
                  onClick={() => {
                    setPage(Math.max(0, page - 1));
                  }}
                >
                  ◁
                </Button>
                <Button>{page}</Button>
                <Button
                  id="Next"
                  onClick={() => {
                    setPage(Math.max(0, page + 1));
                  }}
                >
                  ▷
                </Button>
              </ButtonGroup>
            </Flex>
            <Table
              colorScheme="blackAlpha"
              maxWidth={{ base: "390px", md: "98%" }}
              marginLeft={{ base: "0", md: "1.5rem" }}
            >
              <Thead>
                <Tr maxWidth="100vw">
                  <Th width="1ch" color="white">
                    #
                  </Th>
                  <Th color="white">TITULO</Th>
                  <Th color="white">ALBUM</Th>
                  <Th fontSize="md">🕑</Th>
                </Tr>
              </Thead>

              <Tbody>
                {songs.map((song, id) => {
                  const duration = new Date(song.duration_ms);
                  return (
                    <Tr
                      key={song.id}
                      maxWidth="100vw"
                      id={"Itemsong" + id}
                      cursor="pointer"
                      _hover={{ bg: "whiteAlpha.300" }}
                      onClick={() => {
                        setSelectedSong([song, duration]);
                      }}
                    >
                      <Td>{id + 1}</Td>
                      <Td>{song.name}</Td>
                      <Td>{song.album.name}</Td>
                      <Td>
                        {duration.getMinutes()}:
                        {duration.getSeconds().toString().padStart(2, "0")}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </>
        ) : (searchKey.length > 0) & loading ? (
          <Box>CARGANDO...</Box>
        ) : error ? (
          <Flex
            border="solid red"
            justify="center"
            margin="5rem 10rem"
            bg="red.800"
            padding="10rem"
            textAlign="center"
            fontSize="20px"
            fontWeight="bold"
            rounded="lg"
            id="Error"
          >
            EL VALOR INGRESADO NO EXISTE
            <br />
            ERROR CODE -404-
          </Flex>
        ) : (
          <Box display={{ base: "none", md: "block" }}>
            <img
              src="https://cdn.wallpapersafari.com/73/36/kjoK1u.png"
              alt=""
            />
          </Box>
        )}
      </Box>

      <ModalDetail
        data={selectedSong}
        isOpen={selectedSong != null}
        onClose={() => {
          setSelectedSong(null);
        }}
      />
    </Box>
  );
};

export default Spotify;
