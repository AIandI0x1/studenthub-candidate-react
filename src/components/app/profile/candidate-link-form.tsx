import { Button } from "@/components/ui/button"
import {
    DialogClose,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { CandidateLink } from "@/models/candidate-link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
  } from "@/components/ui/form";
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { useState } from "react"
import { createCandidateLink, updateCandidateLink } from "@/providers/logged-in/candidate-link.service"
import { useAppDispatch, useAppSelector } from "@/store/store"
import { setUser } from "@/store/slices/userSlice"
import { errorMessage } from "@/utils/common"
import { alertDialog } from "@/hooks/use-alert-dialog"
import { Candidate } from "@/models/candidate"

export const CandidateLinkForm = ({ candidateLink, onClose }: { candidateLink: CandidateLink | null, onClose: () => void }) => {

    const [isSaving, setIsSaving] = useState(false);

    const { t } = useTranslation();
 
    const dispatch = useAppDispatch();

    const { user } = useAppSelector(state => state.user) as { user: Candidate };
    
    const formSchema = z.object({
        title: z.string({
            required_error: t('Please enter title')
        }).min(1, t('Please enter title')),
        url: z.string({
            required_error: t("Please enter url")
        }).url(t("Please enter valid url"))
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "all",
        defaultValues: {
            title: candidateLink?.title || "",
            url: candidateLink?.url || "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
         
        setIsSaving(true);

        let action: any;
        if (!candidateLink) {
            action = createCandidateLink;
        } else {
            action = updateCandidateLink;
        }

        const candidateLinkModel = new CandidateLink();
        candidateLinkModel.cl_uuid = candidateLink?.cl_uuid || "";
        candidateLinkModel.title = values.title;
        candidateLinkModel.url = values.url;

        action(candidateLinkModel).then((response: any) => {

            if (response.operation == "success") {
                dispatch(setUser({ user: {
                    ...user,
                    candidateLinks: response.candidateLinks 
                } }));

                onClose();

            } else {
                alertDialog({
                    title: t("Error"),
                    description: errorMessage(response.message),
                });
            }

        }).catch((error: any) => {
            console.log(error);
        }).finally(() => {
            form.reset();
            setIsSaving(false);
        });
    }

    return (
        <Form   {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <DialogHeader>
                    <DialogTitle>{ candidateLink ? t("Update Link") : t("Add Links to Your Profile")}</DialogTitle>
                </DialogHeader>

                <div className="grid w-full max-w-sm items-center gap-1.5 my-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t("Link Title")}</FormLabel>
                            <FormControl>
                                <Input placeholder="GitHub, Portfolio, Blog, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5  my-4">
                    <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel> {t("URL")}</FormLabel>
                            <FormControl>
                                <Input placeholder="https://example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" className='bg-slate-900 text-white'>
                        { candidateLink ? t("Update Link") : t("Add Link")}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    )
}