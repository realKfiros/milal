import {ExampleRow} from "../row";
import {DialogContent} from "@/interfaces/dialog_content.ts";

export const Rules: DialogContent = {
	title: 'חוקי המשחק',
	element: () => <div dir="rtl">
		<p>המטרה היא לנחש את המילה בשישה ניסיונות.</p>
		<p>כל המילים הן באורך 5 אותיות.</p>
		<p>אחרי כל ניסיון צבעי האותיות ישתנו בהתאם.</p>
		<br/>
		<p><b>דוגמאות</b></p>
		<p>האות ע נמצאת במילה אותה אנו מחפשים בדיוק במקום הנכון</p>
		<ExampleRow key="example-1" exampleWord="עיגול" word="עעעעע"/>
		<p>האות ק נמצאת במילה אותה אנו מחפשים אך במקום אחר</p>
		<ExampleRow key="example-2" exampleWord="בקבוק" word="קסססס"/>
		<p>הרמטכ״ל צהוב</p>
		<ExampleRow key="example-3" exampleWord="רמטכל" word="לכמטר"/>
		<br/>
		<p>עקבו אחריי בטוויטר:
			<br/>
			<a href="https://twitter.com/realKfiros">
				<img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/realKfiros?style=social"/>
			</a>
		</p>
		<p>קנו לי קפה:
			<br/>
			<a href="https://www.buymeacoffee.com/kfiros" target="_blank">
				<img src="https://img.shields.io/badge/-buy_me_a%C2%A0coffee-gray?logo=buy-me-a-coffee" alt="Buy Me A Coffee"/>
			</a>
		</p>
	</div>,
	buttons: [],
};
