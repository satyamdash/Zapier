"use client"
import { Appbar } from "@/components/Appbar";
import { DarkButton } from "@/components/buttons/DarkButton";
import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL, HOOKS_URL } from "../config";
import { LinkButton } from "@/components/buttons/LinkButton";
import { useRouter } from "next/navigation";

interface Zap {
    "id": string,
    "triggerId": string,
    "userId": number,
    "createdAt": string,
    "actions": {
        "id": string,
        "zapId": string,
        "actionId": string,
        "sortingOrder": number,
        "type": {
            "id": string,
            "name": string
            "image": string
        }
    }[],
    "trigger": {
        "id": string,
        "zapId": string,
        "triggerId": string,
        "type": {
            "id": string,
            "name": string,
            "image": string
        }
    }
}

function useZaps() {
    const [loading, setLoading] = useState(true);
    const [zaps, setZaps] = useState<Zap[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/zap`, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })
            .then(res => {
                setZaps(res.data.zaps);
                setLoading(false)
            })
    }, []);

    const deleteZaps = async (zapIds: string[]) => {
        setLoading(true);
        console.log(zapIds);
        try {
            await axios.delete(`${BACKEND_URL}/api/v1/zap`, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                },
                data: { ids: zapIds }
            });
            // Refresh the zaps list after deletion
            const res = await axios.get(`${BACKEND_URL}/api/v1/zap`, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });
            setZaps(res.data.zaps);
        } catch (error) {
            console.error("Failed to delete zaps:", error);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading, zaps, deleteZaps
    }
}

export default function() {
    const { loading, zaps, deleteZaps } = useZaps();
    const router = useRouter();
    
    return <div>
        <Appbar />
        <div className="flex justify-center pt-8">
            <div className="max-w-screen-lg	 w-full">
                <div className="flex justify-between pr-8 ">
                    <div className="text-2xl font-bold">
                        My Zaps
                    </div>
                    <DarkButton onClick={() => {
                        router.push("/zap/create");
                    }}>Create</DarkButton>
                </div>
            </div>
        </div>
        {loading ? "Loading..." : <div className="flex justify-center"> <ZapTable zaps={zaps} deleteZaps={deleteZaps} /> </div>}
    </div>
}

function ZapTable({ zaps, deleteZaps }: {zaps: Zap[], deleteZaps: (zapIds: string[]) => Promise<void>}) {
    const router = useRouter();
    const [selectedZaps, setSelectedZaps] = useState<Set<string>>(new Set());
    
    const toggleZapSelection = (zapId: string) => {
        const newSelection = new Set(selectedZaps);
        if (newSelection.has(zapId)) {
            newSelection.delete(zapId);
        } else {
            newSelection.add(zapId);
        }
        setSelectedZaps(newSelection);
    };
    
    const handleDeleteSelected = async () => {
        if (selectedZaps.size === 0) return;
        if (confirm(`Are you sure you want to delete ${selectedZaps.size} zap(s)?`)) {
            await deleteZaps(Array.from(selectedZaps));
            setSelectedZaps(new Set());
        }
    };
    
    return <div className="p-8 max-w-screen-lg w-full">
        <div className="flex justify-between mb-4">
            <div className="text-sm text-gray-500">
                {selectedZaps.size > 0 ? `${selectedZaps.size} zap(s) selected` : ''}
            </div>
            {selectedZaps.size > 0 && (
                <DarkButton onClick={handleDeleteSelected}>Delete Selected</DarkButton>
            )}
        </div>
        <div className="flex">
                <div className="w-10"></div>
                <div className="flex-1">Name</div>
                <div className="flex-1">ID</div>
                <div className="flex-1">Created at</div>
                <div className="flex-1">Webhook URL</div>
                <div className="flex-1">Go</div>
        </div>
        {zaps.map(z => <div key={z.id} className="flex border-b border-t py-4 items-center">
            <div className="w-10">
                <input 
                    type="checkbox" 
                    checked={selectedZaps.has(z.id)}
                    onChange={() => toggleZapSelection(z.id)}
                    className="w-4 h-4"
                />
            </div>
            <div className="flex-1 flex"><img src={z.trigger.type.image} className="w-[30px] h-[30px]" /> {z.actions.map(x => <img key={x.id} src={x.type.image} className="w-[30px] h-[30px]" />)}</div>
            <div className="flex-1">{z.id}</div>
            <div className="flex-1">{new Date(z.createdAt).toLocaleDateString()}</div>
            <div className="flex-1">{`${HOOKS_URL}/hooks/catch/1/${z.id}`}</div>
            <div className="flex-1"><LinkButton onClick={() => {
                    router.push("/zap/" + z.id)
                }}>Go</LinkButton></div>
        </div>)}
    </div>
}