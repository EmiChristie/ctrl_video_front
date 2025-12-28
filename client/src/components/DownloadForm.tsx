import { Box, Button, createListCollection, DownloadTrigger, Flex,  FormatByte,  Icon, Input, InputGroup, Portal, Presence, Select, Spinner, } from "@chakra-ui/react";
import { AudioLines, CirclePlay, DownloadIcon, Tally1, } from "lucide-react";
import { groupBy } from "es-toolkit"
import { useState } from "react";
import { LuDownload } from "react-icons/lu";

const DownloadForm: React.FC = () => {

    const [url, setUrl] = useState("");
    const [videoIcon,setVideoIcon] = useState(true);
    const [format, setFormat] = useState<string[]>(["video_mp4_480"])
    const [downloadTriggered, setDownloadTriggered] = useState(false);
    const [pct, setPct] = useState(0);
    const data = "video aqui"

    const collection = createListCollection({
      items: [
        { label: "MP4 (1080p)", value: "video_mp4_1080", category: "Video" },
        { label: "MP4 (720p)", value: "video_mp4_720", category: "Video" },
        { label: "MP4 (480p)", value: "video_mp4_480", category: "Video" },
        { label: "MP4 (360p)", value: "video_mp4_360", category: "Video" },
        { label: "MP3", value: "audio_mp3", category: "Audio" },
        { label: "OGG", value: "audio_ogg", category: "Audio" },
        { label: "WAV", value: "audio_wav", category: "Audio" },
        { label: "FLAC", value: "audio_flac", category: "Audio" },
        { label: "M4A", value: "audio_m4a", category: "Audio" },
        { label: "WEBM", value: "audio_webm", category: "Audio" },
      ],
    })

    const categories = Object.entries(
      groupBy(collection.items, (item) => item.category),
    )

    const changeFormat = (e:string[]) => {
      //alert(e);
      setFormat(e);
     // alert(e[0].split("_")[0])
     setVideoIcon(e[0].split("_")[0] === "video")
    }

    const download = () => {
      setDownloadTriggered(true);
    }


  return (
    <>
    
    <Flex gap={4}>
      <Box w={"full"} className="button-85">
        <Flex alignItems={"center"}>
        <InputGroup 
            w={"full"}
            m={"0.5rem"}
            border={"none"}
            outline={"none"}
            startElement={
              videoIcon ?
              <CirclePlay 
                strokeWidth={1.2}
              />
              :
              <AudioLines
                strokeWidth={1.2}
              />
            }>
          <Input 
            ml={4}
            value={url}
            onChange={(e) => {
              setUrl(e.currentTarget.value)
            }}
            border={"none"}
            outline={"none"}
            color={"#F1F5F8"}
            placeholder={`URL do ${videoIcon ? "vídeo":"áudio"}...`} />
        </InputGroup>
        <Icon p={0} mr={-6}>
          <Tally1 color={"#F1F5F820"} size={48} strokeWidth={0.8}/>
        </Icon>
        <Select.Root 
        borderRadius={"sm"} 
        _hover={{bgColor:"#272d3aff"}} 
        mr={4} 
        collection={collection} 
        size="sm" 
        width="220px" 
        defaultValue={["mp4_480"]}
        value={format}
        onValueChange={(e)=>changeFormat(e.value)}
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger disabled={downloadTriggered} cursor={downloadTriggered ? "forbidden":"pointer"} border={"none"}outline={"none"}>
              <Select.ValueText color={"#F1F5F8"} placeholder="Formato" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content maxH={"200px"} p={4} shadow={"sm"} bgColor={"#2F3747"}>
                {categories.map(([category, items]) => (
                  <Select.ItemGroup key={category}>
                    <Select.ItemGroupLabel>{category}</Select.ItemGroupLabel>
                    {items.map((item) => (
                      <Select.Item item={item} key={item.value}>
                        {item.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.ItemGroup>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
        </Flex>
      </Box>
      <Box position={"relative"}>
        <Button disabled={downloadTriggered} h={"full"} onClick={()=>download()} px={5} pb={1} alignContent={"center"} className={`button-95 ${!downloadTriggered ? "enabled-button" : "" }`} role="button">
            <Icon>
              <DownloadIcon color={"#F1F5F8"}/>
            </Icon>
        </Button>
      </Box>
    </Flex>

    <Presence 
    present={downloadTriggered}
    animationName={{ _open: "fade-in", _closed: "fade-out" }}
    animationDuration="slower"
    mt={6}>
      <Box>
          <Button cursor={"default"} className="button-105" w={"max"} bgColor={"#ac5990d5"} color={"#faeeffff"} title="Download em progresso">
            <Spinner size={"md"} color="#faeeffff" borderWidth="5px" animationDuration="0.65s" />
            Download em {pct == 0 ? "progresso" : pct+"%"}, aguarde...
          </Button>
          {
            /*
          <DownloadTrigger
          className="button-95"
            data={data}
            fileName="titulo.extensao"
            mimeType="video/mp4 ou audio/webm por exemplo"
            asChild
          >
            <Button variant="outline">
              <LuDownload /> Baixar o {videoIcon ? "vídeo" : "áudio"} (
              <FormatByte value={data.length} unitDisplay="narrow" />)
            </Button>
          </DownloadTrigger>
          */
          }
      </Box>
    </Presence>
    </>
  );
};

export default DownloadForm;
