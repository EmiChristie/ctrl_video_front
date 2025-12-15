import { Alert, Box, Button, Center, createListCollection, Flex, Icon, Input, InputGroup, Portal, Presence, Select, Separator, Text } from "@chakra-ui/react";
import { CirclePlay, Download, DownloadIcon, InfoIcon, Tally1, Video } from "lucide-react";

const DownloadForm: React.FC = () => {

    const frameworks = createListCollection({
      items: [
        { label: "MP4 (1080p)", value: "mp4_1080" },
        { label: "MP4 (720p)", value: "mp4_720" },
        { label: "MP4 (480p)", value: "mp4_480" },
        { label: "MP4 (360p)", value: "mp4_360" },
        { label: "MP3", value: "mp3" },
        { label: "OGG", value: "ogg" },
        { label: "WAV", value: "wav" },
        { label: "FLAC", value: "flac" },
        { label: "M4A", value: "m4a" },
        { label: "WEBM", value: "webm" },
      ],
    })

  return (
    <>
    
    <Flex gap={4}>
      <Box w={"full"} className="button-85">
        <Flex alignItems={"center"}>
        <InputGroup 
            m={"0.5rem"}
            border={"none"}
            outline={"none"}
            startElement={
            <CirclePlay 
              strokeWidth={1.2}
            />
            }>
          <Input 
            ml={4}
            border={"none"}
            outline={"none"}
            color={"#F1F5F8"}
            placeholder="URL do vídeo..." />
        </InputGroup>
        <Icon p={0} mr={-6}>
          <Tally1 color={"#F1F5F820"} size={48} strokeWidth={0.8}/>
        </Icon>
        <Select.Root mr={4} collection={frameworks} size="sm" width="190px" defaultValue={["mp4_480"]}>
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger  cursor={"pointer"} border={"none"}outline={"none"}>
              <Select.ValueText color={"#F1F5F8"} placeholder="Formato" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content maxH={"200px"} p={4} shadow={"sm"} bgColor={"#2F3747"}>
                {frameworks.items.map((framework) => (
                  <Select.Item borderRadius={"md"} _hover={{bgColor:"#F57AC240", cursor:"pointer"}} bgColor={"#2F3747"} item={framework} key={framework.value}>
                    {framework.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
        </Flex>
      </Box>
      <button className="button-95" role="button">
        <span className="text">
          <Box px={5}>
            <Icon>
              <DownloadIcon color={"#F1F5F8"}/>
            </Icon>
          </Box>
        </span>
      </button>
    </Flex>

    </>
  );
};

export default DownloadForm;
