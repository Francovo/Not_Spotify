import {
    Avatar,
    Badge,
    Box,
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
  } from "@chakra-ui/react";


export const ModalDetail = ({ data, isOpen, onClose }) => {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg='white'>
          {data != null && (
            <>
              <ModalHeader display="flex" flexDirection="column">
                <Flex justify="space-between" align="center">
                  {data[0].name}
                  <Badge ml="1" fontSize=".9em" bg="none" color="#1DB954">
                    {data[1].getMinutes()}:
                    {data[1].getSeconds().toString().padStart(2, "0")}
                  </Badge>
                </Flex>
                <a href={data[0].external_urls.spotify} target="_blank" rel="noreferrer">
                  <Text
                    fontWeight="normal"
                    fontSize="sm"
                    textDecoration="underline"
                    color="GrayText"
                  >
                    ▷ Escuchar
                  </Text>
                </a>
              </ModalHeader>
  
              <ModalBody display="flex" gap="5" flexDirection="column">
                {/* <HStack>
                      <Tag key={language} variant="subtle" colorScheme="purple">
                        {language}
                      </Tag>
                    ))}
                  </HStack>
                  
                  <Text color={repo.description ? "black" : "GrayText"}>
                    {repo.description ? repo.description : "Sin Descripcion"}
                  </Text> */}
                <Flex justifyContent="center">
                  <audio src={data[0].preview_url} controls></audio>
                </Flex>
  
                <Flex
                  bg="blackAlpha.800"
                  padding=".7rem"
                  color="white"
                  borderRadius="5px"
                >
                  <Avatar src={data[0].album.images[0].url}></Avatar>
                  <Box ml="3">
                    <a href={data[0].external_urls.spotify} target="_blank" rel="noreferrer">
                      <Text fontWeight="bold">{data[0].artists[0].name}</Text>
                      <Text fontSize="sm">{data[0].album.name}</Text>
                    </a>
                  </Box>
                </Flex>
              </ModalBody>
              <ModalFooter>
                <Button id="closeModal" onClick={onClose}>Close</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  }