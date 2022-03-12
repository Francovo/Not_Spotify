import Spotify from '../components/Principal';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider resetCSS>
    <Spotify/>
    </ChakraProvider>
  );
}

export default App;
