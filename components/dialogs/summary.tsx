import {Stats} from "@/components/stats";
import {DialogContent} from "@/interfaces/dialog_content.ts";
import {useMidnightCountdown} from "@/hooks/midnight_contdown.ts";

export const SummaryDialog: DialogContent = {
	element: () => <Summary />,
};

const Summary = () =>
{
	const countdown = useMidnightCountdown();
	return <>
		<Stats />
		<span className="fs-3">מילהל חדש: {countdown}</span>
	</>;
};
