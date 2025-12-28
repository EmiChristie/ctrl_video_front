import { Box, Button, createListCollection, DownloadTrigger, Flex,  FormatByte,  Icon, Input, InputGroup, Portal, Presence, Select, Spinner, } from "@chakra-ui/react";
import { AudioLines, CirclePlay, DownloadIcon, Tally1, } from "lucide-react";
import { groupBy } from "es-toolkit"
import { useRef, useState } from "react";
import { LuDownload } from "react-icons/lu";

const DownloadForm: React.FC = () => {

    const ws = useRef<WebSocket | null>(null);

    const [url, setUrl] = useState("");
    const [videoIcon,setVideoIcon] = useState(true);
    const [selection, setSelection] = useState<string[]>(["video_mp4_480"])
    const [format, setFormat] = useState<string>("mp4")
    const [downloadTriggered, setDownloadTriggered] = useState(false);
    const [quality, setQuality] = useState("480");
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("");
    const [fileName, setFileName] = useState<string | null>(null);
    const [pct, setPct] = useState(0);
    const [downloadReady, setDownloadReady] = useState(false);
    const [data, setData] = useState<{
  file: Blob;
  mimetype: string;
  extension: string;
  size: number;
} | null>(null);

    const collection = createListCollection({
      items: [
        { label: "MP4 (1080p)", value: "video_mp4_1080", category: "Video" },
        { label: "MP4 (720p)", value: "video_mp4_720", category: "Video" },
        { label: "MP4 (480p)", value: "video_mp4_480", category: "Video" },
        { label: "MP4 (360p)", value: "video_mp4_360", category: "Video" },
        { label: "MP3", value: "audio_mp3", category: "Audio" },
      ],
    })

    const categories = Object.entries(
      groupBy(collection.items, (item) => item.category),
    )

    const changeFormat = (e:string[]) => {
      //alert(e);
      setFormat(e[0].split("_")[1]);
      setQuality(e[0].split("_")[2]);
      setSelection(e)
     // alert(e[0].split("_")[0])
     setVideoIcon(e[0].split("_")[0] === "video")
    }

    const download = () => {
      setDownloadReady(false);
      setDownloadTriggered(true);
      setProgress(0);
      setStatus("Baixando...");
      setFileName(null);

      ws.current = new WebSocket("ws://localhost:3001");

      ws.current.onopen = () => {
        ws.current?.send(
          JSON.stringify({
            url,
            format,
            quality,
          })
        );
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.progress !== undefined) {
          setProgress(data.progress);
        }

        if (data.done) {
          setStatus("Prontinho! Cheque sua pasta de downloads :3");
          setFileName(data.fileName);
          ws.current?.close();
          setDownloadReady(true);
        }

        if (data.error) {
          setStatus(data.error);
          ws.current?.close();
        }
      };

      ws.current.onerror = () => {
        setStatus("Erro de conexão");
      };
    };

    const saveFile = () => {
      if (!fileName) return;

      window.location.href = `http://localhost:3001/download/${encodeURIComponent(
        fileName
      )}`;
    };

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
            disabled={downloadTriggered && !downloadReady}
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
        defaultValue={["video_mp4_480"]}
        value={selection}
        onValueChange={(e)=>changeFormat(e.value)}
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger disabled={downloadTriggered && !downloadReady} cursor={downloadTriggered && !downloadReady ? "forbidden":"pointer"} border={"none"}outline={"none"}>
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
        <Button disabled={downloadTriggered && !downloadReady} h={"full"} onClick={()=>download()} px={5} pb={1} alignContent={"center"} className={`button-95 ${!downloadTriggered && !downloadReady ? "enabled-button" : "" }`} role="button">
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

      <Flex color={"#c4c3c4ff"} gap={4} alignItems={"center"}>
        <p>{progress}%</p>
        <progress
          value={progress}
          max={100}
          style={{
            width: 420,
            height: 12,
            borderRadius: 6,
            overflow: 'hidden',
            appearance: 'none',
          }}
        />
        <p>{status}</p>
      </Flex>

    </Presence>
    </>
  );
};

export default DownloadForm;
