chrome.extension.sendMessage({}, function(response) {
    const parseJobDetailsFromDescription = jiraDesc => {
        const parsedDesc = jiraDesc
            .split('\n')
            .join('')
            .split('*')
            .join('');
        try {
            const jobId = parsedDesc
                .match('Job Audit ID:(.*)Job Type:')[1]
                .trim();
            const jobType = parsedDesc.match('Job Type:(.*)Cluster:')[1].trim();
            const domain = parsedDesc
                .match('Domain:(.*)Failure Reason')[1]
                .trim();
            const clusterName = parsedDesc
                .match('Cluster:(.*)Domain:')[1]
                .trim();

            return {
                jobId,
                jobType,
                domain,
                clusterName
            };
        } catch (e) {
            console.log(e.message);
            return {
                jiraDesc,
                errorMsg: e.message
            };
        }
    };

    var readyStateCheckInterval = setInterval(function() {
        if (document.readyState === 'complete') {
            clearInterval(readyStateCheckInterval);
            const renderRescheduleBtn = () => {
                const customRescheduleBtn = document.createElement('span');
                customRescheduleBtn.className = 'sc-htpNat fhCVvF';
                customRescheduleBtn.innerHTML = `<button external-id="issue-links" type="button" class="css-p30t9v" style="cursor: pointer; "><span class="css-j8fq0c"><span class="css-8xpfx5"><span class="sc-bxivhb gJZUbH"><span class="Icon__IconWrapper-dyhwwi-0 jdkWJB" aria-label="Reschedule Job"><svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><g fill="currentColor" fill-rule="evenodd"><path d="M12.856 5.457l-.937.92a1.002 1.002 0 0 0 0 1.437 1.047 1.047 0 0 0 1.463 0l.984-.966c.967-.95 2.542-1.135 3.602-.288a2.54 2.54 0 0 1 .203 3.81l-2.903 2.852a2.646 2.646 0 0 1-3.696 0l-1.11-1.09L9 13.57l1.108 1.089c1.822 1.788 4.802 1.788 6.622 0l2.905-2.852a4.558 4.558 0 0 0-.357-6.82c-1.893-1.517-4.695-1.226-6.422.47"></path><path d="M11.144 19.543l.937-.92a1.002 1.002 0 0 0 0-1.437 1.047 1.047 0 0 0-1.462 0l-.985.966c-.967.95-2.542 1.135-3.602.288a2.54 2.54 0 0 1-.203-3.81l2.903-2.852a2.646 2.646 0 0 1 3.696 0l1.11 1.09L15 11.43l-1.108-1.089c-1.822-1.788-4.802-1.788-6.622 0l-2.905 2.852a4.558 4.558 0 0 0 .357 6.82c1.893 1.517 4.695 1.226 6.422-.47"></path></g></svg></span></span></span><span class="css-mu6jxl">Reschedule Job</span></span></button>`;
                const descEl = document.querySelector('.ak-renderer-document');
                const jiraDescText = descEl.textContent;
                const job = parseJobDetailsFromDescription(jiraDescText);
                console.log(job);
                if (!('errorMsg' in job)) {
                    const rescheduleUrl = `https://app.chargebee.com/admin/reschedule?id=${job.jobId}&cluster_name=${job.clusterName}`;
                    customRescheduleBtn.onclick = () =>
                        window.open(rescheduleUrl, '_blank');
                }
                return customRescheduleBtn;
            };

            const renderJobAuditBtn = () => {
                const customJobAuditBtn = document.createElement('span');
                customJobAuditBtn.style.marginLeft = '10px';
                customJobAuditBtn.className = 'sc-htpNat fhCVvF';
                customJobAuditBtn.innerHTML = `<button external-id="issue-links" type="button" class="css-p30t9v" style="cursor: pointer; "><span class="css-j8fq0c"><span class="css-8xpfx5"><span class="sc-bxivhb gJZUbH"><span class="Icon__IconWrapper-dyhwwi-0 jdkWJB" aria-label="Job Audit"><svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><g fill="currentColor" fill-rule="evenodd"><path d="M12.856 5.457l-.937.92a1.002 1.002 0 0 0 0 1.437 1.047 1.047 0 0 0 1.463 0l.984-.966c.967-.95 2.542-1.135 3.602-.288a2.54 2.54 0 0 1 .203 3.81l-2.903 2.852a2.646 2.646 0 0 1-3.696 0l-1.11-1.09L9 13.57l1.108 1.089c1.822 1.788 4.802 1.788 6.622 0l2.905-2.852a4.558 4.558 0 0 0-.357-6.82c-1.893-1.517-4.695-1.226-6.422.47"></path><path d="M11.144 19.543l.937-.92a1.002 1.002 0 0 0 0-1.437 1.047 1.047 0 0 0-1.462 0l-.985.966c-.967.95-2.542 1.135-3.602.288a2.54 2.54 0 0 1-.203-3.81l2.903-2.852a2.646 2.646 0 0 1 3.696 0l1.11 1.09L15 11.43l-1.108-1.089c-1.822-1.788-4.802-1.788-6.622 0l-2.905 2.852a4.558 4.558 0 0 0 .357 6.82c1.893 1.517 4.695 1.226 6.422-.47"></path></g></svg></span></span></span><span class="css-mu6jxl">Job Audit</span></span></button>`;
                const descEl = document.querySelector('.ak-renderer-document');

                const jiraDescText = descEl.textContent;

                const job = parseJobDetailsFromDescription(jiraDescText);

                if (!('errorMsg' in job)) {
                    const auditUrl = `https://app.chargebee.com/admin/view?table_names=sch_job_audits&action=view&sch_job_audits.id=${job.jobId}&use_shard=false&site_domain=${job.domain}%C2%A0&schema_type=GENERAL`;
                    customJobAuditBtn.onclick = () =>
                        window.open(auditUrl, '_blank');
                }
                return customJobAuditBtn;
            };

            const renderEntityAuditsBtn = () => {
                const customJobAuditBtn = document.createElement('span');
                customJobAuditBtn.style.marginLeft = '10px';
                customJobAuditBtn.className = 'sc-htpNat fhCVvF';
                customJobAuditBtn.innerHTML = `<button external-id="issue-links" type="button" class="css-p30t9v" style="cursor: pointer; "><span class="css-j8fq0c"><span class="css-8xpfx5"><span class="sc-bxivhb gJZUbH"><span class="Icon__IconWrapper-dyhwwi-0 jdkWJB" aria-label="Job Audit"><svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation"><g fill="currentColor" fill-rule="evenodd"><path d="M12.856 5.457l-.937.92a1.002 1.002 0 0 0 0 1.437 1.047 1.047 0 0 0 1.463 0l.984-.966c.967-.95 2.542-1.135 3.602-.288a2.54 2.54 0 0 1 .203 3.81l-2.903 2.852a2.646 2.646 0 0 1-3.696 0l-1.11-1.09L9 13.57l1.108 1.089c1.822 1.788 4.802 1.788 6.622 0l2.905-2.852a4.558 4.558 0 0 0-.357-6.82c-1.893-1.517-4.695-1.226-6.422.47"></path><path d="M11.144 19.543l.937-.92a1.002 1.002 0 0 0 0-1.437 1.047 1.047 0 0 0-1.462 0l-.985.966c-.967.95-2.542 1.135-3.602.288a2.54 2.54 0 0 1-.203-3.81l2.903-2.852a2.646 2.646 0 0 1 3.696 0l1.11 1.09L15 11.43l-1.108-1.089c-1.822-1.788-4.802-1.788-6.622 0l-2.905 2.852a4.558 4.558 0 0 0 .357 6.82c1.893 1.517 4.695 1.226 6.422-.47"></path></g></svg></span></span></span><span class="css-mu6jxl">Entity Audits (Manual)</span></span></button>`;
                const descEl = document.querySelector('.ak-renderer-document');

                const jiraDescText = descEl.textContent;

                const job = parseJobDetailsFromDescription(jiraDescText);

                if (!('errorMsg' in job)) {
                    const auditUrl = `https://app.chargebee.com/admin/databrowser?table_names=sch_job_audits&site_domain=${job.domain}&schema=general&filter%5Bcolumn%5D%5B1%5D=sch_job_audits%5Bentity_id%5D&filter%5Bcond%5D%5B1%5D=equals&filter%5Binput%5D%5B1%5D=0000&max_id=1&time_flt%5Bcond%5D=timeFlt&time_flt%5Bval%5D=no_filter`;

                    customJobAuditBtn.onclick = () =>
                        window.open(auditUrl, '_blank');
                }
                return customJobAuditBtn;
            };

            // MutationObserver is not working properly so we're using setTimeout for now.
            const descElCheckInterval = setInterval(function() {
                const el = document.querySelector('.ak-renderer-document');
                if (el != null && el.textContent.length) {
                    const customBtnWrapper = document.createElement('div');
                    customBtnWrapper.style.marginBottom = '20px';
                    customBtnWrapper.appendChild(renderRescheduleBtn());
                    customBtnWrapper.appendChild(renderJobAuditBtn());
                    customBtnWrapper.appendChild(renderEntityAuditsBtn());
                    document
                        .querySelector(
                            '[data-test-id="issue.views.field.rich-text.description"]'
                        )
                        .parentNode.prepend(customBtnWrapper);
                    clearInterval(descElCheckInterval);
                }
            }, 2000);
        }
    }, 10);
});
