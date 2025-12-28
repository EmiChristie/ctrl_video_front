import { Box, Span, Text } from "@chakra-ui/react"
import DownloadForm from "./components/DownloadForm"

function App() {
  return (
    <>
      <Box className="body" h={"100vh"} w={"100vw"} px={"30vh"} bgColor={"#2F3747"}>
        <Box pt={"12vh"}>
          <Text className="title" zIndex={2} color={"#F1F5F8"} fontWeight={"black"} fontSize={"4.5rem"}>Ctrl + V<Span color={"#F57AC2"}>ideo</Span></Text>
        </Box>
        <Box pt={"5vh"}>
          <DownloadForm />
        </Box>
      </Box>
    </>
  )
}

export default App
