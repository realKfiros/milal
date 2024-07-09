import {game} from "../stores/game.store.ts";
import {renderToStaticMarkup} from "react-dom/server";

const Component = () =>
{
	const getMobileOperatingSystem = () =>
	{
		const userAgent = navigator.userAgent || navigator.vendor;
		if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i))
			return "iOS";
		else if (userAgent.match(/Android/i))
			return "Android";
		else
			return "unknown";
	};

	const onClick = () =>
	{
		if (getMobileOperatingSystem() !== "unknown")
			navigator.share({
				title: "מילהל",
				text: game.shareText,
			});
		else
			navigator.clipboard.writeText(game.shareText);
	};

	return <button className="btn btn-link" onClick={onClick}>
		{navigator.canShare?.() ? "שתף תוצאה" : "העתק תוצאה"}
	</button>;
}

export const shareOrCopy = renderToStaticMarkup(<Component/>);
