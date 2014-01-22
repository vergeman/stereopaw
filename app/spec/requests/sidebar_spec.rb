require 'spec_helper'

describe "Root Page" do

  describe "Visits '/' page" do

    before {
      visit root_path()
    }

    describe "Sidebar Section" do

      describe "has a navigation box" do
        
        it "of element nav" do
          page.should have_css("div#sidebar > nav")
        end

        #requried for further tests
        it "is an unordered list (ul)" do
          page.should have_css("div#sidebar > nav > ul")
        end


        describe "with list navigation elements" do 
          
          #setup our navbar elements
          @navbar = [
                     {
                       :content => 'My Links',
                       :div => '#links'
                     },
                     {
                       :content => 'Playlists',
                       :div => '#playlist'
                     },
                     {
                       :content => 'New',
                       :div => '#new'
                     },
                     {
                       :content => 'Popular',
                       :div => '#popular'
                     },
                     {
                       :content => 'Submit',
                       :div => '#submit'
                     },
                     {
                       :content => 'Settings',
                       :div => '#settings'
                     }
                    ]

          #loop and test
          @navbar.each do | e |

            it "with content #{e[:content]}" do
              page.should have_content(e[:content])
            end

            it "a list element with id #{e[:div]}" do
              page.should have_css("ul > li" + e[:div])
            end            
          end


        end

      end



    end #end sidebar

  end #end visits

end
