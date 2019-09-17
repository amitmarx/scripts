for filename in $PWD/*json; do
cat $filename | jq '{"visitors.list.item.new.badge": ."visitors.list.item.new.badge", "online.visitors.show.more": ."online.visitors.show.more", "online.visitors.show.less": ."online.visitors.show.less", "visitors.list.item.on.page.label": ."visitors.list.item.on.page.label"}' > "${filename}1"
done;


for f in $PWD/*.json; do
rm $f; done;

for f in $PWD/*.json1; do
mv $f "${f: :-1}"; done; #Remove last letter
