import {observer} from "mobx-react-lite";
import {useEffect, useRef} from "react";
import {Modal} from "bootstrap";
import {dialog} from "../stores/dialog.store.ts";

export const Dialog = observer(() =>
{
	const dialogRef = useRef<HTMLDivElement>(null);
	const {opened, title, content: Content, closeDialog} = dialog;

	useEffect(() =>
	{
		if (opened)
			showModal();
		else
			hideModal();
	}, [opened]);

	const showModal = () =>
	{
		const dialog = new Modal(dialogRef.current!, {
			backdrop: 'static',
			keyboard: false
		});
		dialog.show();
	};

	const hideModal = () =>
	{
		if (dialogRef.current)
		{
			const dialog = Modal.getInstance(dialogRef.current);
			dialog?.hide();
		}
	};

	return <div className="modal fade" dir="rtl" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true" ref={dialogRef}>
		{Content && <div className="modal-dialog modal-dialog-centered">
			<div className="modal-content">
				<div className="modal-header">
					{!!title && <h5 className="modal-title" id="exampleModalLabel">{title}</h5>}
					<button type="button" className="btn-close" onClick={closeDialog} aria-label="Close"/>
				</div>
				<div className="modal-body">
					{Content && <Content />}
				</div>
			</div>
		</div>}
	</div>;
});
