import { useState } from "react";
import { processAll } from "../store/action";
export function useProcessAll() {
  const [progress, setProgress] = useState({
    progress: 1,
    processed: 0,
    size: 1,
    current: "",
  });
  const [percent, setPercent] = useState(0);
  const [processedPercent, setProcessedPercent] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [cancel, setCancel] = useState<any>(null);
  let updatePercent = (progress: any) => {
    setPercent(
      progress.size == 0
        ? 0
        : ((progress.processed + progress.progress) / progress.size) * 100
    );
    setProcessedPercent((progress.processed / progress.size) * 100);
    if (
      progress.canceled ||
      progress.progress + progress.processed == progress.size
    )
      setTimeout(() => {
        setModalOpen(false);
      }, 0);
    else setModalOpen(true);
  };
  const progressHandler = async (progress: any) => {
    if (progress.cancel) {
      setCancel(progress.cancel);
      return;
    }
    setProgress(progress);
    updatePercent(progress);
  };
  const startProcessAll = async (resultHandler: (proc: any) => any) => {
    let proc = await processAll(progressHandler);
    resultHandler.call(null, proc);
  };
  return {
    cancel,
    progress,
    setProgress,
    percent,
    setPercent,
    processedPercent,
    setProcessedPercent,
    modalOpen,
    setModalOpen,
    updatePercent,
    progressHandler,
    startProcessAll,
  };
}
